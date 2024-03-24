const WebSocket = require('ws');
const { Server } = require('ws');
const {
  blockchain,
  privateKey,
  address,
  getTransactionPool,
  updateTransactionsPool,
  getBlockChain,
  addBlock,
  replaceChain,
} = require('./data');
let {
  transactionPool,
  addTransactionToPool,
  removeTransactionFromPool,
} = require('./data');
const Block = require('./Block');
const { validateTransaction } = require('./Transaction');
const Transaction = require('./Transaction');
const ProoFOfWork = require('./ProofOfWork');
const BlockChain = require('./BlockChain');
// import {
//     addBlockToChain, Block, getBlockchain, getLatestBlock, handleReceivedTransaction, isValidBlockStructure,
//     replaceChain
// } from './blockchain';
// import {Transaction} from './transaction';
// import {getTransactionPool} from './transactionPool';

const sockets = [];

const initP2PServer = (p2pPort) => {
  const server = new Server({ port: p2pPort });
  server.on('connection', (ws) => {
    initConnection(ws);
  });
  console.log('listening websocket p2p port on: ' + p2pPort);
};

const getSockets = () => sockets;

const initConnection = (ws) => {
  sockets.push(ws);
  initMessageHandler(ws);
  initErrorHandler(ws);
  write(ws, queryChainLengthMsg());

  // query transactions pool only some time after chain query
  setTimeout(() => {
    broadcast(queryTransactionPoolMsg());
  }, 500);
};

const JSONToObject = (data) => {
  try {
    return JSON.parse(data);
  } catch (e) {
    console.log(e);
    return null;
  }
};

const MessageType = {
  QUERY_LATEST: 0,
  QUERY_ALL: 1,
  RESPONSE_BLOCKCHAIN: 2,
  QUERY_TRANSACTION_POOL: 3,
  RESPONSE_TRANSACTION_POOL: 4,
  FOUND_NEW_BLOCK: 5,
  ACCEPT_NEW_BLOCK: 6,
  VERIFIED_NEW_BLOCK: 7,
};

const initMessageHandler = (ws) => {
  ws.on('message', (data) => {
    try {
      const message = JSONToObject(data);
      if (message === null) {
        console.log('could not parse received JSON message: ' + data);
        return;
      }
      console.log('Received message: %s', JSON.stringify(message));
      switch (message.type) {
        case MessageType.QUERY_LATEST:
          write(ws, responseLatestMsg());
          break;
        case MessageType.QUERY_ALL:
          write(ws, responseChainMsg());
          break;
        case MessageType.RESPONSE_BLOCKCHAIN:
          const receivedBlocks = JSONToObject(message.data);
          if (receivedBlocks === null) {
            console.log(
              'invalid blocks received: %s',
              JSON.stringify(message.data)
            );
            break;
          }
          handleBlockchainResponse(receivedBlocks);
          break;
        case MessageType.QUERY_TRANSACTION_POOL:
          write(ws, responseTransactionPoolMsg());
          break;
        case MessageType.RESPONSE_TRANSACTION_POOL:
          const receivedTransactions = JSONToObject(message.data);

          if (receivedTransactions === null) {
            console.log(
              'invalid transaction received: %s',
              JSON.stringify(message.data)
            );
            break;
          }
          const oldLength = getTransactionPool().length;
          for (let i = 0; i < receivedTransactions.length; i++) {
            const transaction = receivedTransactions[i];
            try {
              const validation = Transaction.validateTransaction(
                getBlockChain(),
                transaction
              );
              // handleReceivedTransaction(transaction);
              // if no error is thrown, transaction was indeed added to the pool
              // let's broadcast transaction pool
              if (validation) {
                addTransactionToPool([transaction]);
              }
            } catch (e) {
              console.log(e.message);
            }
          }
          const newLength = getTransactionPool().length;
          console.log(oldLength, newLength);
          if (oldLength < newLength) {
            broadCastTransactionPool();
          }
          break;
        case MessageType.FOUND_NEW_BLOCK:
          const newBlock = JSONToObject(message.data);
          const usedTransactionsObj = JSONToObject(message.usedTransactions);
          const usedTransactions = [];
          for (const key in usedTransactionsObj) {
            usedTransactions.push(usedTransactionsObj[key]);
          }
          newBlock.transactions = usedTransactions;
          const verify = ProoFOfWork.verifyHash(newBlock, blockchain);
          if (verify === true) {
            addBlock(newBlock);

            removeTransactionFromPool(usedTransactions);

            broadcast(verifiedNewBlock(newBlock));
          }

          break;
        case MessageType.VERIFIED_NEW_BLOCK:
          const newVerifedBlocks = JSONToObject(message.data);
          const updatedTransactionsPool = JSONToObject(
            message.updatedTransactionsPool
          );

          if (ProoFOfWork.verifyHash(newVerifedBlocks[0], blockchain)) {
            addBlock(newVerifedBlocks[0]);
          }

          updateTransactionsPool(updatedTransactionsPool);

          break;
      }
    } catch (e) {
      console.log(e);
    }
  });
};

const write = (ws, message) => ws.send(JSON.stringify(message));
const broadcast = (message) =>
  sockets.forEach((socket) => write(socket, message));

const queryChainLengthMsg = () => ({
  type: MessageType.QUERY_LATEST,
  data: null,
});

const queryAllMsg = () => ({ type: MessageType.QUERY_ALL, data: null });

const responseChainMsg = () => ({
  type: MessageType.RESPONSE_BLOCKCHAIN,
  data: JSON.stringify(blockchain.getChains()),
});

const responseLatestMsg = () => ({
  type: MessageType.RESPONSE_BLOCKCHAIN,
  data: JSON.stringify([BlockChain.getLatestBlock(blockchain)]),
});

const queryTransactionPoolMsg = () => ({
  type: MessageType.QUERY_TRANSACTION_POOL,
  data: null,
});

const newBlockMsg = (block) => ({
  type: MessageType.FOUND_NEW_BLOCK,
  data: JSON.stringify(block),
  usedTransactions: JSON.stringify(getTransactionPool()),
});

const verifiedNewBlock = (block) => ({
  type: MessageType.VERIFIED_NEW_BLOCK,
  data: JSON.stringify([block]),
  updatedTransactionsPool: JSON.stringify(getTransactionPool()),
});
const responseTransactionPoolMsg = () => {
  return {
    type: MessageType.RESPONSE_TRANSACTION_POOL,
    data: JSON.stringify(getTransactionPool()),
  };
};

const initErrorHandler = (ws) => {
  const closeConnection = (myWs) => {
    console.log('connection failed to peer: ' + myWs.url);
    sockets.splice(sockets.indexOf(myWs), 1);
  };
  ws.on('close', () => closeConnection(ws));
  ws.on('error', () => closeConnection(ws));
};

const handleBlockchainResponse = (receivedBlocks) => {
  if (receivedBlocks.length === 0) {
    console.log('received block chain size of 0');
    return;
  }
  const latestBlockReceived = receivedBlocks[receivedBlocks.length - 1];
  if (!Block.isValidBlockStructure(latestBlockReceived)) {
    console.log('block structure not valid');
    return;
  }
  let latestBlockHeld = BlockChain.getLatestBlock(blockchain);
  if (!latestBlockHeld) {
    latestBlockHeld = { index: -1, prevHash: -1 };
  }

  if (latestBlockReceived.index > latestBlockHeld.index) {
    console.log(
      'blockchain possibly behind. We got: ' +
        latestBlockHeld.index +
        ' Peer got: ' +
        latestBlockReceived.index
    );
    if (latestBlockHeld.blockHash === latestBlockReceived.prevHash) {
      if (addBlock(latestBlockReceived)) {
        broadcast(responseLatestMsg());
      }
    } else if (receivedBlocks.length === 1) {
      if (receivedBlocks[0].index === 0) {
        replaceChain(receivedBlocks);
      } else {
        console.log('We have to query the chain from our peer');
        broadcast(queryAllMsg());
      }
    } else {
      console.log('Received blockchain is longer than current blockchain');
      replaceChain(receivedBlocks);
    }
  } else {
    console.log(
      'received blockchain is not longer than received blockchain. Do nothing'
    );
  }
};

const broadcastLatest = () => {
  broadcast(responseLatestMsg());
};

const broadcastNewBlockMined = (block, transactions) => {
  broadcast(newBlockMsg(block, transactions));
};

const connectToPeers = (newPeer) => {
  const ws = new WebSocket(newPeer);

  ws.on('open', () => {
    initConnection(ws);
  });
  ws.on('error', () => {
    console.log('connection failed');
  });
};

const broadCastTransactionPool = () => {
  broadcast(responseTransactionPoolMsg());
};

module.exports = {
  connectToPeers,
  broadcastLatest,
  broadCastTransactionPool,
  initP2PServer,
  getSockets,
  broadcastNewBlockMined,
};

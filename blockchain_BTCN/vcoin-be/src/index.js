const express = require('express');
const {
  blockchain,
  transactionPool,
  getTransactionPool,
  addTransactionToPool,
  setPrivateKey,
  setAddress,
  getAddress,
  checkHoldTransaction,
  setHoldTransaction,
  getBlockChain,
} = require('./data');
const cors = require('cors');
const Wallet = require('./Wallet');
const ProofOfWork = require('./ProofOfWork');

const {
  broadCastTransactionPool,
  initP2PServer,
  connectToPeers,
  broadcastNewBlockMined,
  getSockets,
} = require('./p2p');
const BlockChain = require('./BlockChain');

const httpPort = parseInt(process.argv[2]) || 3001;
const p2pPort = parseInt(process.argv[3]) || 6001;

const initHttpServer = (httpPort) => {
  const app = express();
  app.use(express.json());
  app.use(cors());
  app.get('/blocks', (req, res) => {
    return res.json(blockchain.blocks);
  });

  app.get('/walletExists', (req, res) => {
    return res.json({ isExists: Wallet.privateKeyExists() });
  });
  app.get('/blocks', (req, res) => {
    const { page } = req.query.page;

    return res.json(blockchain.blocks);
  });

  app.get('/transactions', (req, res) => {
    const { page } = req.query.page;

    const transactions = blockchain.getAllTransactions(getTransactionPool());
    const result = transactions.map((transaction) => {
      let transactionInfo = null;

      transactionInfo = blockchain.getTransactionInfo(transaction);
      return {
        ...transactionInfo,
        status: transaction.status,
      };
    });

    return res.json(result);
  });

  app.get('/wallets', (req, res) => {
    return res.json(Wallet.getWallets());
  });

  app.get('/walletInfo', (req, res) => {
    const address = Wallet.getPublicKey();

    return res.json({
      publicAddress: address,
      balance: blockchain.getBalance(address),
    });
  });

  app.get('/balance/:address', (req, res) => {
    const balance = blockchain.getBalance(req.params.address);

    return res.json(balance);
  });

  app.post('/sendcoin', (req, res) => {
    const { from, to, amount } = req.body;
    if (checkHoldTransaction() === true) {
      res.status(400).json({
        message: 'Please wait for your past transactions to complete',
      });
    } else {
      const transactions = blockchain.sendCoin(from, to, parseInt(amount));
      addTransactionToPool(transactions);
      setHoldTransaction(true);
      broadCastTransactionPool();

      return res.json(transactions);
    }
  });

  app.post('/addPeer', (req, res) => {
    const curTotal = getSockets().length;
    connectToPeers(req.body.peer);
    const newTotal = getSockets().length;
    if (curTotal < newTotal) {
      return res.json({
        status: 'success',
      });
    } else
      return res.json({
        status: 'failed',
      });
  });

  app.get('/transactionPool', (req, res) => {
    return res.json(getTransactionPool());
  });

  app.get('/peers', (req, res) => {
    return res.json(getSockets());
  });

  app.post('/wallet/init', async (req, res) => {
    const { password } = req.body;
    let init = false;
    if (Wallet.privateKeyExists()) {
      init = true;
    } else init = Wallet.initWallet();

    if (init === true) {
      setPrivateKey(Wallet.getPrivateKey());
      setAddress();
      const setPassword = Wallet.setPassword(getAddress(), password);

      if (setPassword) {
        return res.status(201).send({
          status: 'success',
          ...Wallet.getWallets(),
        });
      }

      return res.json({
        result: 'failed',
      });
    }
    return res.json({
      result: 'failed',
    });
  });

  app.get('/mineTransactions', (req, res) => {
    const transactions = [...getTransactionPool()];

    const lastestBlock = BlockChain.getLatestBlock(blockchain);
    const block = ProofOfWork.findBlock(
      lastestBlock.index + 1,
      lastestBlock.blockHash,
      new Date().getTime() / 100,
      transactions,
      ProofOfWork.getAdjustedDifficulty(blockchain)
    );

    broadcastNewBlockMined(block);

    res.json({
      block,
      status: 'success',
    });
  });

  app.get('/block/:id', (req, res) => {
    return res.json(getBlockChain().blocks[req.params.id]);
  });

  app.get('/transaction/:id', (req, res) => {
    const transactions = blockchain.getAllTransactions(getTransactionPool());
    const result = transactions.map((transaction) => {
      let transactionInfo = null;

      transactionInfo = blockchain.getTransactionInfo(transaction);
      return {
        ...transactionInfo,
        status: transaction.status,
      };
    });

    for (let i = 0; i < result.length; i++) {
      if (result[i].id === req.params.id) {
        return res.json(result[i]);
      }
    }
  });

  app.listen(httpPort, () => {
    console.log('Http server listening on PORT: ', httpPort);
  });
};

initHttpServer(httpPort);
initP2PServer(p2pPort);

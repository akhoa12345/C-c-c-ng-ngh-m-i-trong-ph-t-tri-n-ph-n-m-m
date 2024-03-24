const BlockChain = require('./BlockChain');
const Transaction = require('./Transaction');
const Wallet = require('./Wallet');
const mode = process.argv[4] ? 'genesis' : 'normal';
const fs = require('fs');

let transactionPool = [];
const blockchain = new BlockChain([]);

let holdTransaction = false;
let privateKey = '';
let address = '';

let savedChain = [];
try {
  savedChain = JSON.parse(fs.readFileSync('./data/chain.json'));
} catch (err) {
  savedChain = { chain: [] };
}

if (savedChain.chain && savedChain.chain.length !== 0) {
  blockchain.blocks = savedChain.chain;
} else {
  if (mode === 'genesis') {
    if (!Wallet.privateKeyExists()) {
      privateKey = Wallet.initWallet();
    }
    address = Wallet.getPublicKey();
    blockchain.newGenesisBlock(
      Transaction.newCoinBaseTX(address, 'first wallet, rewards pool')
    );
    const saveChain = fs.writeFileSync(
      './data/chain.json',
      JSON.stringify({
        chain: blockchain.blocks,
      })
    );
  }
}

const getBlockChain = () => {
  return blockchain;
};
const addBlock = (verfiedBlock) => {
  blockchain.blocks.push(verfiedBlock);
  const saveChain = fs.writeFileSync(
    './data/chain.json',
    JSON.stringify({
      chain: blockchain.blocks,
    })
  );
};

const replaceChain = (newChain) => {
  blockchain.blocks = newChain;
  const saveChain = fs.writeFileSync(
    './data/chain.json',
    JSON.stringify({
      chain: blockchain.blocks,
    })
  );
};
const addTransactionToPool = (verifedTransactions) => {
  for (let i = 0; i < verifedTransactions.length; i++) {
    const transaction = verifedTransactions[i];
    let count = 0;
    for (let j = 0; j < transactionPool.length; j++) {
      if (transactionPool[j].id === transaction.id) {
        count++;
        break;
      }
    }
    if (count === 0) {
      transactionPool.push(transaction);
    }
  }
};

const removeTransactionFromPool = (verifedTransactions) => {
  let newPool = [];
  for (let i = 0; i < transactionPool.length; i++) {
    const transaction = transactionPool[i];
    let count = 0;
    for (let j = 0; j < verifedTransactions.length; j++) {
      if (transaction.id === verifedTransactions[j].id) {
        count++;
        break;
      }
    }
    if (count === 0) {
      newPool.push(transaction);
    }
  }

  transactionPool = newPool;
  setHoldTransaction(false);
};

const getPrivateKey = () => privateKey;
const getTransactionPool = () => {
  return transactionPool;
};

const updateTransactionsPool = (updated) => {
  transactionPool = updated;
  if (transactionPool.length === 0) {
    setHoldTransaction(false);
  }
};
const checkHoldTransaction = () => holdTransaction;
const setHoldTransaction = (newVal) => (holdTransaction = newVal);
const setPrivateKey = (key) => (privateKey = key);
const setAddress = () => (address = Wallet.getPublicKey());
const getAddress = () => address;
module.exports = {
  blockchain,
  getBlockChain,
  replaceChain,
  addBlock,
  transactionPool,
  getTransactionPool,
  addTransactionToPool,
  removeTransactionFromPool,
  updateTransactionsPool,
  checkHoldTransaction,
  setHoldTransaction,
  getPrivateKey,
  privateKey,
  address,
  setAddress,
  setPrivateKey,
  getAddress,
};

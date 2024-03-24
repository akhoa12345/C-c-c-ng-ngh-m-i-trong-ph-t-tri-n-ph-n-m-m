const Block = require('./Block');
const ProofOfWork = require('./ProofOfWork');
const Transaction = require('./Transaction');
const TxIn = require('./TxIn');
const TxOut = require('./TxOut');
const UnspentTxOut = require('./UnspentTxOut');
const Wallet = require('./Wallet');
const { START_DIFFICULTY } = require('./constVal');

class BlockChain {
  constructor(blocks) {
    this.blocks = blocks;
  }

  static getLatestBlock(blockchain) {
    return blockchain.blocks[blockchain.blocks.length - 1];
  }

  getChains() {
    return this.blocks;
  }

  newGenesisBlock(coinBaseTransaction) {
    const timestamp = new Date().getTime() / 100;
    const index = 0;
    const prevHash = '';
    const genesisBlock = ProofOfWork.findBlock(
      index,
      prevHash,
      timestamp,
      [coinBaseTransaction],
      START_DIFFICULTY
    );

    this.blocks = [];
    this.blocks.push(genesisBlock);
  }
  addBlock(transaction) {
    const lastestBlock = this.blocks[this.blocks.length - 1];
    const nextIndex = lastestBlock.index + 1;
    const timeStamp = new Date().getTime() / 1000;
    const newBlock = ProofOfWork.findBlock(
      nextIndex,
      lastestBlock.blockHash,
      timeStamp,
      transaction,
      ProofOfWork.getAdjustedDifficulty(this)
    );

    this.blocks.push(newBlock);
  }

  printBlockChains() {
    this.blocks.forEach((block) => {
      console.log(`Prev hash: ${block.prevHash}`);
      console.log(`Transactions: ${block.transactions}`);
      console.log(`Hash: ${block.blockHash}`);
      console.log('\n');
    });
  }

  findUnspentTx(address) {
    const blockchain = this.blocks;
    const unspentTxs = [];
    let spentTxOuts = new Map();

    for (let i = 0; i < blockchain.length; i++) {
      const block = blockchain[i];

      for (let j = 0; j < block.transactions.length; j++) {
        const transaction = block.transactions[j];

        if (!Transaction.isCoinBase(transaction)) {
          for (let k = 0; k < transaction.txIns.length; k++) {
            const txIn = transaction.txIns[k];
            if (TxIn.canUnlockOutputWith(address, txIn, transaction)) {
              if (!spentTxOuts.get(txIn)) {
                spentTxOuts.set(txIn.txOutId, [txIn.txOutIndex]);
              } else
                spentTxOuts.set(txIn.txOutId, [
                  ...spentTxOuts.get(txIn),
                  txIn.txOutIndex,
                ]);
            }
          }
        }
      }
    }

    for (let i = 0; i < blockchain.length; i++) {
      const block = blockchain[i];

      for (let j = 0; j < block.transactions.length; j++) {
        const transaction = block.transactions[j];

        Outputs: for (let i = 0; i < transaction.txOuts.length; i++) {
          const curTxOut = transaction.txOuts[i];
          if (spentTxOuts.get(transaction.id)) {
            const spentOuts = spentTxOuts.get(transaction.id);
            for (let j = 0; j < spentOuts.length; j++) {
              if (
                spentOuts[j] !== curTxOut &&
                TxOut.canBeUnlockedWith(address, curTxOut)
              ) {
                unspentTxs.push(transaction);
                continue Outputs;
              }
            }
          } else if (TxOut.canBeUnlockedWith(address, curTxOut)) {
            unspentTxs.push(transaction);
          }
        }
      }
    }

    return [spentTxOuts, unspentTxs];
  }

  findUnspentTxOuts(address) {
    const [spentTxOuts, unspentTXs] = this.findUnspentTx(address);

    const result = [];
    for (let i = 0; i < unspentTXs.length; i++) {
      const spentTxtOutsByT = spentTxOuts.get(unspentTXs[i].id);
      const txOuts = unspentTXs[i].txOuts;

      for (let j = 0; j < txOuts.length; j++) {
        if (TxOut.canBeUnlockedWith(address, txOuts[j])) {
          if (spentTxtOutsByT === undefined) {
            result.push(
              new UnspentTxOut(
                unspentTXs[i].id,
                j,
                txOuts[j].address,
                txOuts[j].amount
              )
            );
          } else if (spentTxtOutsByT.includes(j) === false) {
            result.push(
              new UnspentTxOut(
                unspentTXs[i].id,
                j,
                txOuts[j].address,
                txOuts[j].amount
              )
            );
          }
        }
      }
    }

    return result;
  }

  getBalance(address) {
    return this.findUnspentTxOuts(address)
      .map((uTxO) => uTxO.amount)
      .reduce((a, b) => a + b, 0);
  }

  findSpendableOutputs(address, amount) {
    let resultAmount = 0;
    const resultOutputs = [];
    const unspentTxOuts = this.findUnspentTxOuts(address);

    for (let i = 0; i < unspentTxOuts.length && resultAmount < amount; i++) {
      const txOut = unspentTxOuts[i];
      resultOutputs.push(txOut);
      resultAmount += txOut.amount;
    }

    return [resultAmount, resultOutputs];
  }

  sendCoin(from, to, amount) {
    const transaction = Transaction.newUTXOTransaction(from, to, amount, this);
    const signed = Transaction.signTxIns(
      transaction,
      Wallet.getPrivateKey(),
      this.findUnspentTxOuts(from)
    );

    const transactions = [signed];

    return transactions;
  }

  updateChain(newBlock) {
    const verifyResult = ProofOfWork.verifyHash(newBlock, this);

    if (!verifyResult) {
    } else {
      this.blocks.push(newBlock);
      return true;
    }

    return false;
  }
  // getPendingTransactionInfo(transaction) {
  //       const from = '';
  //       const to = transaction.txOuts[0].address;
  //       if (!Transaction.isCoinBase(transaction)) {
  //         for (let i = 0; i < this.blocks.length; i++) {
  //           const block = this.blocks[i];
  //           for (let j = 0; j < block.transactions.length; j++) {
  //             const bTransaction = block.transactions[j];
  //             if (transaction.txtIns[0].txtOutId === bTransaction.id) {
  //               from = bTransaction.txtOuts[0].address;
  //             }
  //           }
  //         }
  //       }

  //       return {
  //         id: transaction.id,
  //         from,
  //         to,
  //       };
  // }

  getTransactionInfo(transaction) {
    let from = '';
    let to = transaction.txOuts[0].address;
    if (!Transaction.isCoinBase(transaction)) {
      for (let i = 0; i < this.blocks.length; i++) {
        const block = this.blocks[i];
        for (let j = 0; j < block.transactions.length; j++) {
          const bTransaction = block.transactions[j];
          if (transaction.txIns[0].txOutId === bTransaction.id) {
            from = bTransaction.txOuts[0].address;
          }
        }
      }
    }

    return {
      id: transaction.id,
      from,
      to,
    };
  }

  getAllTransactions(transactionPool) {
    const result = [];
    for (let i = 0; i < this.blocks.length; i++) {
      const block = this.blocks[i];
      for (let j = 0; j < block.transactions.length; j++) {
        const transaction = block.transactions[j];
        result.push({ ...transaction, status: 'Success' });
      }
    }

    for (let i = 0; i < transactionPool.length; i++) {
      result.push({ ...transactionPool[i], status: 'Pending' });
    }
    return result;
  }

  findAllUnspentTx() {
    const blockchain = this.blocks;
    const unspentTxs = [];
    let spentTxOuts = new Map();

    for (let i = 0; i < blockchain.length; i++) {
      const block = blockchain[i];

      for (let j = 0; j < block.transactions.length; j++) {
        const transaction = block.transactions[j];

        if (!Transaction.isCoinBase(transaction)) {
          for (let k = 0; k < transaction.txIns.length; k++) {
            const txIn = transaction.txIns[k];

            if (!spentTxOuts.get(txIn)) {
              spentTxOuts.set(txIn.txOutId, [txIn.txOutIndex]);
            } else
              spentTxOuts.set(txIn.txOutId, [
                ...spentTxOuts.get(txIn),
                txIn.txOutIndex,
              ]);
          }
        }
      }
    }

    for (let i = 0; i < blockchain.length; i++) {
      const block = blockchain[i];

      for (let j = 0; j < block.transactions.length; j++) {
        const transaction = block.transactions[j];

        Outputs: for (let i = 0; i < transaction.txOuts.length; i++) {
          const curTxOut = transaction.txOuts[i];
          if (spentTxOuts.get(transaction.id)) {
            const spentOuts = spentTxOuts.get(transaction.id);
            for (let j = 0; j < spentOuts.length; j++) {
              if (spentOuts[j] !== curTxOut) {
                unspentTxs.push(transaction);
                continue Outputs;
              }
            }
          } else {
            unspentTxs.push(transaction);
          }
        }
      }
    }

    return [spentTxOuts, unspentTxs];
  }

  findAllUnspentTxOuts() {
    const [spentTxOuts, unspentTXs] = this.findAllUnspentTx();

    const result = [];
    for (let i = 0; i < unspentTXs.length; i++) {
      const spentTxtOutsByT = spentTxOuts.get(unspentTXs[i].id);
      const txOuts = unspentTXs[i].txOuts;

      for (let j = 0; j < txOuts.length; j++) {
        if (spentTxtOutsByT === undefined) {
          result.push(
            new UnspentTxOut(
              unspentTXs[i].id,
              j,
              txOuts[j].address,
              txOuts[j].amount
            )
          );
        } else if (spentTxtOutsByT.includes(j) === false) {
          result.push(
            new UnspentTxOut(
              unspentTXs[i].id,
              j,
              txOuts[j].address,
              txOuts[j].amount
            )
          );
        }
      }
    }

    return result;
  }
}

module.exports = BlockChain;

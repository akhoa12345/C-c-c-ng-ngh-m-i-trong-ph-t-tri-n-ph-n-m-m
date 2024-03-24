const CryptoJs = require('crypto-js');
const TxIn = require('./TxIn');
const TxOut = require('./TxOut');
const { START_REWARD_COINS, START_AWARD_COINS } = require('./constVal');
const ec = require('elliptic').ec;
const EC = new ec('secp256k1');
const Wallet = require('./Wallet');

class Transaction {
  constructor(id, txIns, txOuts) {
    this.id = id;
    this.txIns = txIns;
    this.txOuts = txOuts;
  }

  static getTransactionId(transaction) {
    const txInContent = transaction.txIns
      .map((txIn) => txIn.txOutId + txIn.txOutIndex)
      .reduce((a, b) => a + b, '');

    const txOutContent = transaction.txOuts
      .map((txOut) => txOut.address + txOut.amount)
      .reduce((a, b) => a + b, '');

    return CryptoJs.SHA256(txInContent + txOutContent).toString();
  }

  static isCoinBase(transaction) {
    return (
      transaction.txIns.length === 1 &&
      transaction.txIns[0].txOutIndex === -1 &&
      transaction.txIns[0].txOutId === ''
    );
  }
  static newCoinBaseTX(to, data) {
    if (data === '') {
      data = 'Reward to ' + to;
    }

    const txin = new TxIn('', -1, data);
    const txout = new TxOut(to, START_REWARD_COINS);
    const newTX = new Transaction(null, [txin], [txout]);
    newTX.id = this.getTransactionId(newTX);

    return newTX;
  }

  static newUTXOTransaction(from, to, amount, blockchain, privateKey) {
    const inputs = [];
    const outputs = [];
    let result = null;

    const [outputAmount, validOutputs] = blockchain.findSpendableOutputs(
      from,
      amount
    );

    if (outputAmount < amount) {
      console.log(`${from} doesnt have enough balance`);
      return result;
    }

    for (let i = 0; i < validOutputs.length; i++) {
      const unspendOutput = validOutputs[i];
      let newInput = new TxIn(
        unspendOutput.txOutId,
        unspendOutput.txOutIndex,
        from
      );

      inputs.push(newInput);
    }

    outputs.push(new TxOut(to, amount));

    if (outputAmount > amount) {
      outputs.push(new TxOut(from, outputAmount - amount));
    }

    result = new Transaction(null, inputs, outputs);
    result.id = Transaction.getTransactionId(result);

    //result = result.signTxIns(result, privateKey, validOutputs);
    return result;
  }

  static signTxIns(transaction, privateKey, unspentTxOuts) {
    const dataToSign = transaction.id;
    const key = EC.keyFromPrivate(privateKey, 'hex');
    for (let i = 0; i < transaction.txIns.length; i++) {
      const txIn = transaction.txIns[i];

      const refUnspentTxOut = [];
      unspentTxOuts.forEach((unspentTxOut) => {
        if (
          unspentTxOut.txOutId === txIn.txOutId &&
          unspentTxOut.txOutIndex === txIn.txOutIndex
        ) {
          refUnspentTxOut.push(unspentTxOut);
        }
      });

      if (refUnspentTxOut === null) {
        console.log('Could not find ref txOut');
        throw Error();
      }

      const refAddress = refUnspentTxOut[0].address;

      if (Wallet.getPublicKey(privateKey) !== refAddress) {
        console.log('Not match address that is ref in txIn');
        throw Error();
      }

      const signature = key.sign(dataToSign).toDER();
      transaction.txIns[i].signature = signature;
    }
    return transaction;
  }

  static validateTransaction(blockchain, transaction) {
    // valid id
    if (typeof transaction.id !== 'string') {
      return false;
    }

    const reCalId = this.getTransactionId(transaction);
    if (reCalId !== transaction.id) {
      return false;
    }

    // valid tXIns
    const txIns = transaction.txIns;
    const unspentTxOuts = blockchain.findAllUnspentTxOuts();
    let count = 0;
    for (let i = 0; i < txIns.length; i++) {
      const txIn = txIns[i];
      for (let j = 0; j < unspentTxOuts.length; j++) {
        if (
          txIn.txOutId === unspentTxOuts[j].txOutId &&
          txIn.txOutIndex === unspentTxOuts[j].txOutIndex
        ) {
          const key = EC.keyFromPublic(unspentTxOuts[j].address, 'hex');
          const validSignature = key.verify(transaction.id, txIn.signature);
          if (!validSignature) {
            console.log('invalid signature of txin');
            return false;
          } else {
            count++;
            break;
          }
        }
      }
    }
    if (count === txIns.length) {
      return true;
    } else return false;
  }
}

module.exports = Transaction;

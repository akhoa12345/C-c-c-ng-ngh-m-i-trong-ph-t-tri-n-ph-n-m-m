const CryptoJS = require('crypto-js');

class Block {
  constructor(
    index,
    prevHash,
    timestamp,
    transactions,
    blockHash,
    difficulty,
    nonce
  ) {
    this.index = index;
    this.prevHash = prevHash;
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.blockHash = blockHash;
    this.difficulty = difficulty;
    this.nonce = nonce;
  }

  static calculateHash(
    index,
    prevHash,
    timestamp,
    transactions,
    difficulty,
    nonce
  ) {
    let transactionsHash = '';

    transactions.forEach((transaction) => {
      transactionsHash = transaction.id;
    });

    return CryptoJS.SHA256(
      index + prevHash + timestamp + transactionsHash + difficulty + nonce
    ).toString();
  }

  //   static generateNextBlock = (blockData, prevBlock) => {
  //     let prevHash = '';
  //     let nextIndex = 0;
  //     let nextTimestamp = new Date().getTime() / 1000;

  //     if (prevBlock !== null) {
  //       nextIndex = prevBlock.index + 1;
  //       prevHash = prevBlock.blockHash;
  //     }

  //     let nextHash = this.calculateHash(
  //       nextIndex,
  //       prevHash,
  //       nextTimestamp,
  //       blockData,

  //     );

  //     return new Block(nextIndex, prevHash, nextTimestamp, blockData, nextHash);
  //   };
  static isValidBlockStructure(block) {
    // type check
    if (block === null) {
      return false;
    }

    return (
      typeof block.index === 'number' &&
      typeof block.blockHash === 'string' &&
      typeof block.prevHash === 'string' &&
      typeof block.timestamp === 'number'
    );
  }
}

module.exports = Block;

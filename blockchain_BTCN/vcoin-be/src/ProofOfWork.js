const Block = require('./Block');

const {
  BLOCK_GENERATION_INTERVAL,
  DIFFICULTY_ADJUSTMENT_INTERVAL,
} = require('./constVal');

class ProoFOfWork {
  static getAdjustedDifficulty(blockchain) {
    console.log(blockchain);
    const latestBlock = blockchain.blocks[blockchain.blocks.length - 1];
    const blockChain = blockchain.blocks;

    let prevAdjustmentBlock =
      blockChain[blockChain.length - DIFFICULTY_ADJUSTMENT_INTERVAL];

    if (!prevAdjustmentBlock) {
      prevAdjustmentBlock = blockChain[0];
    }

    const timeExpected =
      BLOCK_GENERATION_INTERVAL * DIFFICULTY_ADJUSTMENT_INTERVAL;

    const timeTaken = latestBlock.timestamp - prevAdjustmentBlock.timestamp;
    if (timeTaken < timeExpected / 2) {
      return prevAdjustmentBlock.difficulty + 1;
    } else if (timeExpected > timeExpected * 2) {
      return prevAdjustmentBlock.difficulty - 1;
    } else return prevAdjustmentBlock.difficulty;
  }

  static verifyHash(newBlock, blockchain) {
    const reHash = Block.calculateHash(
      newBlock.index,
      newBlock.prevHash,
      newBlock.timestamp,
      newBlock.transactions,
      newBlock.difficulty,
      newBlock.nonce
    );

    if (
      newBlock.prevHash !==
      blockchain.blocks[blockchain.blocks.length - 1].blockHash
    ) {
      return false;
    }

    if (reHash === newBlock.blockHash) {
      const rehashRs = this.hashMatchesDifficulty(
        newBlock.blockHash,
        this.getAdjustedDifficulty(blockchain)
      );
      if (rehashRs === false) {
        return false;
      }
    }

    return true;
  }

  static hashMatchesDifficulty(hash, difficulty) {
    const requiredPrefix = '0'.repeat(difficulty);
    return hash.startsWith(requiredPrefix);
  }

  static findBlock = (index, prevHash, timestamp, transactions, difficulty) => {
    let nonce = 0;
    console.log(`Mining new block containing transactions:  ${transactions}`);

    while (true) {
      const blockHash = Block.calculateHash(
        index,
        prevHash,
        timestamp,
        transactions,
        difficulty,
        nonce
      );

      if (this.hashMatchesDifficulty(blockHash, difficulty)) {
        console.log(`Found hash: ${blockHash}, nonce: ${nonce} \n`);
        return new Block(
          index,
          prevHash,
          timestamp,
          transactions,
          blockHash,
          difficulty,
          nonce
        );
      }
      nonce++;
    }
  };
}

module.exports = ProoFOfWork;

const ec = require('elliptic').ec;
const EC = new ec('secp256k1');

class TxIn {
  constructor(txOutId, txOutIndex, signature) {
    // id of transation has the output
    this.txOutId = txOutId;
    this.txOutIndex = txOutIndex;
    this.signature = signature;
  }

  static canUnlockOutputWith(unlockingData, txin, transaction) {
    const key = EC.keyFromPublic(unlockingData, 'hex');
    const validSignature = key.verify(transaction.id, txin.signature);
    return validSignature;
  }
}

module.exports = TxIn;

class TxOut {
  constructor(address, amount) {
    this.address = address;
    this.amount = amount;
  }

  static canBeUnlockedWith(unlockingData, txout) {
    return txout.address === unlockingData;
  }
}

module.exports = TxOut;

require('dotenv');

const ec = require('elliptic').ec;
const EC = new ec('secp256k1');
const privateKeyLocation = './data/wallet.json';
const passphraseLocation = './data/passphrase.json';
const fs = require('fs');
const { generate: passphraseGen } = require('generate-passphrase');
const saltRounds = 10;
const bcrypt = require('bcrypt');

class Wallet {
  constructor() {}

  static privateKeyExists() {
    try {
      let walletData = JSON.parse(fs.readFileSync(privateKeyLocation));

      if (walletData.privateKey) {
        return true;
      }
    } catch (err) {
      return false;
    }
    return false;
  }

  static initWallet() {
    if (this.privateKeyExists(privateKeyLocation)) {
      return false;
    }

    const passphrase = passphraseGen({
      length: 4,
      separator: ' ',
      titlecase: true,
    });

    const newPrivateKey = this.generatePrivateKey();

    const walletData = JSON.stringify({
      privateKey: newPrivateKey,
    });

    const passphraseData = JSON.stringify({
      passphrase,
      wallets: [{ privateKey: newPrivateKey }],
    });

    try {
      fs.writeFileSync(passphraseLocation, passphraseData);
      fs.writeFileSync(privateKeyLocation, walletData);
    } catch (err) {
      console.log('err');
    }

    return true;
  }

  static generatePrivateKey() {
    const keyPair = EC.genKeyPair();
    const privateKey = keyPair.getPrivate();
    return privateKey.toString(16);
  }

  static getPrivateKey() {
    let walletData = JSON.parse(fs.readFileSync(privateKeyLocation));
    return walletData.privateKey;
  }

  static getPublicKey() {
    const privateKey = this.getPrivateKey();
    const key = EC.keyFromPrivate(privateKey, 'hex');
    return key.getPublic().encode('hex');
  }

  static getPublicFromPrivate(privateKey) {
    const key = EC.keyFromPrivate(privateKey, 'hex');
    return key.getPublic().encode('hex');
  }
  static setPassword(address, password) {
    const data = JSON.parse(fs.readFileSync(passphraseLocation));
    for (let i = 0; i < data.wallets.length; i++) {
      const publicAdd = this.getPublicFromPrivate(data.wallets[i].privateKey);
      if (publicAdd === address) {
        const passwordHash = bcrypt.hashSync(password, saltRounds);
        data.wallets[i].passwordHash = passwordHash;

        fs.writeFileSync(passphraseLocation, JSON.stringify(data));

        return true;
      }
    }

    return false;
  }

  static getWallets() {
    if (fs.existsSync(passphraseLocation)) {
      const passphraseData = JSON.parse(fs.readFileSync(passphraseLocation));
      const walletData = JSON.parse(fs.readFileSync(privateKeyLocation));
      const addresses = passphraseData.wallets.map((wallet) => {
        return this.getPublicFromPrivate(wallet.privateKey);
      });
      let selected = 0;
      let firstGen = true;
      for (let i = 0; i < passphraseData.wallets.length; i++) {
        if (walletData.privateKey === passphraseData.wallets[i].privateKey) {
          selected = i;
          if (passphraseData.wallets[i].passwordHash) {
            firstGen = false;
          }
        }
      }
      return {
        passphrase: passphraseData.passphrase,
        addresses,
        selected,
        firstGen,
      };
    }

    return {
      passphrase: '',
      addresses: [],
      selected: 0,
      firstGen: true,
    };
  }
}

module.exports = Wallet;

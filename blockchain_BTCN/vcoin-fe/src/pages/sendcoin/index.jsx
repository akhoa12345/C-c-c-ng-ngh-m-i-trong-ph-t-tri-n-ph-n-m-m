import axios from 'axios';
import Address from './components/Address';
import './sendcoin.css';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { getBalance } from '../../redux/reducers/wallet';
import walletServices from '../../services/wallet';

const SendCoin = () => {
  const userData = useSelector((state) => state.wallets);
  const dispatch = useDispatch();
  const getWallet = (userData) => {
    const publicAddress = userData.addresses[userData.selected];
    const balance = userData.balance;
    return { publicAddress, balance };
  };
  const { publicAddress, balance } = getWallet(userData);

  console.log(userData);
  if (userData.firstGen === true) {
    return <Navigate to="/initWallet" />;
  }

  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState(1);

  useEffect(() => {
    if (userData.firstGen === false) {
      dispatch(getBalance());
    }
  }, []);

  useEffect(() => {
    if (publicAddress !== from && publicAddress) {
      setFrom(publicAddress);
    }
  }, [userData.selected]);

  const handleTextChange = (val) => {
    setTo(val);
  };

  const handleAmountChange = (val) => {
    console.log(val, balance);
    if (val > balance) {
      setAmount(balance);
    } else if (val < 0 || !val) {
      setAmount(0);
    } else setAmount(val);
  };
  const handleSendCoin = async () => {
    try {
      const result = await walletServices.sendCoin(from, to, amount);
      window.alert(
        'Successfully create a transaction, waiting for miner works'
      );
    } catch (err) {
      window.alert('Failed to create a transaction');
    }
  };
  return (
    <>
      <Address type="from" disabled={true} address={from}></Address>
      <Address
        type="to"
        address={to}
        handleTextChange={handleTextChange}
      ></Address>

      <div className="coin-container">
        <div className="amount-container">
          <label htmlFor="amount">Amount send</label>
          <input
            name="amount"
            type="number"
            style={{ display: 'flex' }}
            min={1}
            max={balance}
            value={amount}
            onChange={(e) => handleAmountChange(e.target.value)}
          ></input>
        </div>

        <div className="btn-container">
          <button className="btn" style={{ width: '35%' }}>
            Cancel
          </button>
          <button
            className="btn"
            style={{ width: '60%' }}
            onClick={() => handleSendCoin()}
          >
            Ok
          </button>
        </div>
      </div>
    </>
  );
};

export default SendCoin;

import axios from 'axios';
import './content.css';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getBalance } from '../../../redux/reducers/wallet';

const Content = ({ publicAddress }) => {
  const userData = useSelector((state) => state.wallets);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    if (userData.firstGen === false) {
      dispatch(getBalance());
      setLoading(false);
    }
  }, []);

  return (
    <>
      <div className="wallet-value">
        {!loading && (
          <p className="wallet-value-text">{userData.balance} VCOIN</p>
        )}
      </div>
    </>
  );
};

export default Content;

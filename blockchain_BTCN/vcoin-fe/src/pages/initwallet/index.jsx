import { useState } from 'react';
import './initwallet.css';
import lockImg from '../../assets/padlock.png';
import walletServices from '../../services/wallet';
import Loader from '../../components/Loader/Loader';
import { Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setFirstGen, setWallet } from '../../redux/reducers/wallet';
import Address from '../sendcoin/components/Address';

const InitWallet = () => {
  const firstGen = useSelector((state) => state.wallets.firstGen);
  const userData = useSelector((state) => state.wallets);
  const [displayState, setDisplayState] = useState('password');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const confirmPassPhrase = () => {
    dispatch(setFirstGen(false));
    return <Navigate to="/mywallet" />;
  };
  const dispatch = useDispatch();
  const handleSendPassword = async () => {
    setLoading(true);
    try {
      const initResult = await walletServices.initWallet(password);
      const { status, passphrase, addresses, selected, firstGen } = initResult;

      setLoading(false);
      if (status === 'success') {
        dispatch(
          setWallet({ passphrase, addresses, selected, firstGen: true })
        );
        setDisplayState('passphrase');
      }
    } catch (err) {
      setLoading(false);
    }
  };

  if (firstGen === false) {
    return <Navigate to="/mywallet" />;
  }

  return (
    <div className="init-container">
      {displayState === 'password' && (
        <div className="password-container">
          <img className="lock-img" src={lockImg} alt="lock-img"></img>
          <h3>Set up password to unlock wallet</h3>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></input>
          <button className="init-btn" onClick={() => handleSendPassword()}>
            <Loader small={true} loading={loading} />
            {!loading && 'Ok'}
          </button>
        </div>
      )}
      {displayState === 'passphrase' && (
        <div className="passphrase-container">
          <h3>
            Remember this in order or note down somewhere: {userData.passphrase}
            .
          </h3>
          <button className="init-btn" onClick={() => confirmPassPhrase()}>
            Noted
          </button>
        </div>
      )}
    </div>
  );
};

export default InitWallet;

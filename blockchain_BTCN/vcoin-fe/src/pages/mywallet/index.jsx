import ProfileBar from '../../components/ProfileBar/ProfileBar';
import Content from './components/Content';
import AppBar from '../../components/AppBar/AppBar';
import './mywallet.css';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
const MyWallet = () => {
  const userData = useSelector((state) => state.wallets);
  const firstGen = useSelector((state) => state.wallets.firstGen);

  const getWallet = (userData) => {
    const publicAddress = userData.addresses[userData.selected];
    const balance = userData.balance;
    return { publicAddress, balance };
  };
  const { publicAddress, balance } = getWallet(userData);

  if (firstGen === true) {
    return <Navigate to="/initwallet" />;
  }

  return (
    <div className="my-wallet">
      <ProfileBar accountName={'myAccount'} publicAddress={publicAddress} />
      <Content publicAddress={publicAddress} />
    </div>
  );
};

export default MyWallet;

import { useState } from 'react';
import AppBar from './components/AppBar/AppBar';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import SideBar from './components/SideBar/SideBar';
import MyWallet from './pages/mywallet';
import './app.css';
import SendCoin from './pages/sendcoin';
import Activity from './pages/activity';
import axios from 'axios';
import { useEffect } from 'react';
import InitWallet from './pages/initwallet';
import Loader from './components/Loader/Loader';
import { useDispatch, useSelector } from 'react-redux';
import { getBalance, getWalletInfo } from './redux/reducers/wallet';
import BlockDetail from './pages/detail/BlockDetail';
import TransactionDetail from './pages/detail/TransactionDetail';

function App() {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.wallets);
  const [loading, setLoading] = useState(true);
  // const [wallet, setWallet] = useState({});

  const getCurLocation = () => {
    const arr = window.location.href.split('/');
    return arr[arr.length - 1];
  };

  useEffect(() => {
    dispatch(getWalletInfo());
    setLoading(false);
  }, []);

  if (loading) {
    <Loader />;
  } else
    return (
      <div className="App">
        <Router>
          <SideBar />

          <div className="content">
            <Routes>
              <Route path="/mywallet" element={<MyWallet />}></Route>
              <Route path="/activity" element={<Activity />}></Route>
              <Route path="/sendCoin" element={<SendCoin />}></Route>
              <Route path="/initWallet" element={<InitWallet />}></Route>
              <Route path="/block/:id" element={<BlockDetail />}></Route>
              <Route
                path="/transaction/:id"
                element={<TransactionDetail />}
              ></Route>
              <Route path="*" element={<Navigate to="/initWallet" />}></Route>
              {/* <Route path="/test" element={<Loader small={true} />}></Route> */}
            </Routes>
            {getCurLocation() != 'initwallet' && <AppBar />}
          </div>
        </Router>
      </div>
    );
}

export default App;

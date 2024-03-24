import LogoContainer from './components/LogoContainer/LogoContainer';
import SearchBar from './components/SearchBar/SearchBar';
import './sidebar.css';
import VcoinIcon from '../../assets/vcoin-icon.png';
import React from 'react';
import axios from 'axios';
import config from '../../config/config';
import { connectPeer } from '../../redux/reducers/peerReducer';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import blockServices from '../../services/block';

const networkList = [{ id: 'vcoin', text: 'VCoin', logoSrc: VcoinIcon }];

const SideBar = () => {
  const peers = useSelector((state) => state.peers.connected);
  const [selected, setSelected] = React.useState(-1);
  const [port, setPort] = React.useState(0);
  const dispatch = useDispatch();
  const networkChange = (idx) => {
    setSelected(idx);
  };

  const handleConnectToPeer = async () => {
    const peerAddress = `ws://localhost:${port}`;
    dispatch(connectPeer(peerAddress));
  };

  const handleMineTransactions = async () => {
    try {
      const result = await blockServices.mineTransactions();
      if (result.status === 'success') {
        alert(`Found new block, waiting for confirmation`);
      }
    } catch (err) {
      alert(`Something went wrong, failed mining transactions`);
    }
  };

  useEffect(() => {
    if (peers.length !== 0) {
      alert(`Success connected to new peer at PORT ${port}`);
    }
  }, [peers.length]);

  return (
    <div className="sidebar">
      <LogoContainer />
      <SearchBar />
      <ul className="network-list">
        {networkList.map((network, idx) => {
          return (
            <li
              className={`network-item ${
                selected === idx ? 'item-bg-active' : 'item-bg'
              }`}
              key={network.id}
              onClick={() => networkChange(idx)}
            >
              <img className="network-icon" src={network.logoSrc}></img>
              <p className="network-text">{network.text}</p>
            </li>
          );
        })}
      </ul>

      <div className="connect-to-peer-div">
        <input
          type="text"
          value={port}
          onChange={(e) => setPort(e.target.value)}
        ></input>
        <button
          className="connect-to-peer-btn"
          onClick={() => handleConnectToPeer()}
        >
          Connect to peer
        </button>
        <button
          className="mine-transactions-btn"
          onClick={() => handleMineTransactions()}
        >
          Mine transactions
        </button>
      </div>
    </div>
  );
};

export default SideBar;

import './logocontainer.css';
import Logo from '../../../../assets/logo.png';
import { useState } from 'react';
const LogoContainer = () => {
  const [port, setPort] = useState();
  const handlePeerConnect = () => {
    console.log('hi');
  };
  return (
    <div className="logo-container">
      <img src={Logo} alt="logo" className="logo-img"></img>
      <p className="logo-text">Blockchain</p>
    </div>
  );
};

export default LogoContainer;

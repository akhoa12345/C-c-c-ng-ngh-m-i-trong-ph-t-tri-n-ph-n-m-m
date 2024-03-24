import './address.css';
import avatarUrl from '../../../assets/default-avatar.png';
import { useEffect, useState } from 'react';
const Address = ({ type, disabled, address, handleTextChange }) => {
  return (
    <div className="address-container">
      <img className="address-img" src={avatarUrl}></img>
      <div className="text-container">
        <p>{type}</p>
        <div className="input-address-container">
          <p>0x</p>
          <input
            type="text"
            disabled={disabled}
            value={address}
            onChange={(e) => handleTextChange(e.target.value)}
          ></input>
        </div>
      </div>
    </div>
  );
};

export default Address;

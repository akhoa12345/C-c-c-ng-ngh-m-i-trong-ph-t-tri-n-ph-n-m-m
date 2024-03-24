import './searchbar.css';
import { BsSearch } from 'react-icons/bs';
import React from 'react';

const SearchBar = () => {
  const [focus, setFocus] = React.useState(false);

  const inputFocus = () => {
    setFocus(true);
  };

  const inputOutFocus = () => {
    setFocus(false);
  };

  return (
    <div className={`search-bar ${focus ? 'focus-bg' : 'bg'}`}>
      <BsSearch className="search-icon" size={16} />
      <input
        type="text"
        className={`search-bar-input ${focus ? 'focus-bg' : 'bg'}`}
        onFocus={inputFocus}
        onBlur={inputOutFocus}
      ></input>
    </div>
  );
};

export default SearchBar;

import './activity.css';
import BlockList from './components/BlockList';
import TransactionList from './components/TransactionList';
import { useState } from 'react';

const Activity = () => {
  const [showBlockList, setShowBlockList] = useState(true);
  const toggleSelected = (newVal) => {
    setShowBlockList(newVal);
  };

  return (
    <div className="activity-container">
      <div className="selection-tab">
        <button
          className={`selection-btn ${showBlockList && 'selected-tab'}`}
          onClick={() => toggleSelected(true)}
        >
          Blocks
        </button>
        <button
          className={`selection-btn ${!showBlockList && 'selected-tab'}`}
          onClick={() => toggleSelected(false)}
        >
          Transactions
        </button>
      </div>
      {showBlockList ? (
        <BlockList></BlockList>
      ) : (
        <TransactionList></TransactionList>
      )}
    </div>
  );
};

export default Activity;

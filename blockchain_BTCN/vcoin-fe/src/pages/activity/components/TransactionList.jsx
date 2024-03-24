import { useDispatch, useSelector } from 'react-redux';
import './transactionlist.css';
import { useEffect } from 'react';
import { getTransactions } from '../../../redux/reducers/transactionReducer';

const transactionList = () => {
  const transactions = useSelector((state) => state.transactions);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getTransactions(1));
  }, []);

  const displayAddress = (input) => {
    const reduced = input.slice(0, 10) + '...';
    return '0x' + reduced;
  };

  return (
    <div className="list-container">
      <div className="list-header">
        <h3>Lastest transactions</h3>
      </div>
      {transactions.transactions.map((transaction) => (
        <div key={transaction.id} className="transaction">
          <div className="transaction-info text-center">
            <p>Transaction id:</p>
            <a href={`/transaction/${transaction.id}`}>
              {displayAddress(transaction.id)}
            </a>
          </div>
          <div className="address-info text-left">
            <p>
              {transaction.from ? (
                <a href="#">from: ${displayAddress(transaction.from)}</a>
              ) : (
                'Coin based'
              )}
            </p>
            <p>
              to: <a href="#">{displayAddress(transaction.to)}</a>
            </p>
          </div>
          <div className="status-info text-center">
            <p>Status: {transaction.status}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default transactionList;

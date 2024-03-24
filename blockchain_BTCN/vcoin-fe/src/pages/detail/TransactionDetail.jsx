import { useEffect, useState } from 'react';
import Loader from '../../components/Loader/Loader';
import { useParams } from 'react-router-dom';
import './style.css';
import transactionServices from '../../services/transaction';

const TransactionDetail = () => {
  const { id } = useParams();
  const [detail, setDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const displayAddress = (input) => {
    const reduced = input.slice(0, 10) + '...';
    return '0x' + reduced;
  };
  useEffect(() => {
    setIsLoading(true);
    transactionServices.getTransaction(id).then((data) => {
      console.log(data);
      setDetail(data);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  if (detail) {
    return (
      <div className="detail-container">
        <h1 style={{ textAlign: 'center' }}>Transaction detail</h1>
        <p>ID: 0x{detail.id}</p>
        <p>Transaction status: {detail.status}</p>
        {!detail.from ? (
          <p>from: No addresses. Coin based</p>
        ) : (
          <p>from: 0x{detail.from}</p>
        )}
        <p>to: 0x{detail.to}</p>
      </div>
    );
  }
};

export default TransactionDetail;

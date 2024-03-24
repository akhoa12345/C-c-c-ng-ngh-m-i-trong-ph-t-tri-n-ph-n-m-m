import { useEffect, useState } from 'react';
import Loader from '../../components/Loader/Loader';
import { useParams } from 'react-router-dom';
import blockServices from '../../services/block';
import './style.css';

const BlockDetail = () => {
  const { id } = useParams();
  const [detail, setDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log('???');
    setIsLoading(true);
    blockServices.getBlock(id).then((data) => {
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
        <h1 style={{ textAlign: 'center' }}>Block #{detail.index}</h1>
        <p>Block status: In chain</p>
        <p>Difficulty: {detail.difficulty}</p>
        <p>Nonce: {detail.nonce}</p>
        <p>Total transactions: {detail.transactions.length}</p>
        <p>Reward: 0</p>
        <p>Timestamp: {new Date(detail.timestamp * 100).toString()}</p>
        <p>Block hash: {detail.blockHash}</p>
      </div>
    );
  }
};

export default BlockDetail;

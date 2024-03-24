import { RiMoneyDollarCircleLine } from 'react-icons/ri';
import { SlNotebook } from 'react-icons/sl';
import { BsGem } from 'react-icons/bs';
import { AiOutlineAppstore } from 'react-icons/ai';
import './appbar.css';

const data = [
  {
    text: <p className="icon-text">Wallet</p>,
    icon: <RiMoneyDollarCircleLine size={28} />,
    to: '/mywallet',
  },
  {
    text: <p className="icon-text">Activity</p>,
    icon: <SlNotebook size={28} />,
    to: '/activity',
  },
  {
    text: <p className="icon-text">Coins</p>,
    icon: <BsGem size={28} />,
    to: '/sendcoin',
  },
  {
    text: <p className="icon-text">Details</p>,
    icon: <AiOutlineAppstore size={28} />,
  },
];

export default data;

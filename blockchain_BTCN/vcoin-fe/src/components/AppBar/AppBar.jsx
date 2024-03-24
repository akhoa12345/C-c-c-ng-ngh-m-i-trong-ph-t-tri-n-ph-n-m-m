import appBarData from './data';
import './appbar.css';
import useAppBar from './hooks/useAppBar';
import { Link } from 'react-router-dom';

const AppBar = () => {
  const selected = useAppBar();

  return (
    <div className="app-bar">
      <ul className="item-list">
        {appBarData.map((item, idx) => (
          <li key={idx}>
            <Link
              className={`item ${selected === idx && 'selected'}`}
              to={item.to}
            >
              {item.icon}
              {item.text}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AppBar;

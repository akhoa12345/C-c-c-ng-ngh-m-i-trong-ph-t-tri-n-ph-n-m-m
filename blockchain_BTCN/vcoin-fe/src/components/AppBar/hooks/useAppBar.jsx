import { matchRoutes, useLocation } from 'react-router-dom';

const useAppBar = () => {
  const location = useLocation();
  const path = location.pathname;

  switch (path) {
    case '/mywallet':
      return 0;
    case '/activity':
      return 1;
    case '/sendcoin':
      return 2;
    default:
      return -1;
  }
};

export default useAppBar;

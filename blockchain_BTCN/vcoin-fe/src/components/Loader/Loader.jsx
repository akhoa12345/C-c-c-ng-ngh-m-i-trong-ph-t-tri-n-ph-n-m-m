import './loader.css';

const Loader = ({ small, loading }) => {
  if (loading) {
    return (
      <div
        className={`loader ${small === true ? 'loader-small' : 'loader-big'}`}
      ></div>
    );
  }
  return null;
};

export default Loader;

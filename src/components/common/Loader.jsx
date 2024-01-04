import { MoonLoader } from "react-spinners";

const Loader = ({ isLoading, loadingText }) => {
  return (
    <div className="loader">
      <MoonLoader loading={isLoading} size={50} />
      <div className="loadingText">{loadingText}</div>
    </div>
  );
};
export default Loader;

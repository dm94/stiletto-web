import type React from "react";
import "../css/LoadingScreen.css";

const LoadingPart: React.FC = () => {
  return (
    <div className="preloader-part">
      <div className="loader" />
    </div>
  );
};

export default LoadingPart;

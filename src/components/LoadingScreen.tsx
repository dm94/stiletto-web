import type React from "react";
import "@styles/loading-screen.css";

const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 w-full h-full bg-gray-900">
      <div className="absolute left-1/2 top-1/2 w-[150px] h-[150px] -ml-[75px] -mt-[75px]">
        <div className="loader" />
      </div>
    </div>
  );
};

export default LoadingScreen;

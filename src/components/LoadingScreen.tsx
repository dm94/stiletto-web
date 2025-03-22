import type React from "react";

const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 w-full h-full bg-gray-900">
      <div className="absolute left-1/2 top-1/2 w-[150px] h-[150px] -ml-[75px] -mt-[75px]">
        <div className="relative w-full h-full rounded-full border-3 border-transparent border-t-[#3d3323] animate-spin-slow">
          <div className="absolute inset-[5px] rounded-full border-3 border-transparent border-t-[#aa946c] animate-spin-slower" />
          <div className="absolute inset-[15px] rounded-full border-3 border-transparent border-t-[#e32112] animate-spin-fast" />
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;

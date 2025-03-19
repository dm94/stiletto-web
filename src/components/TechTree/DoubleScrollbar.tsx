import { useState, useEffect, useRef } from "react";

/* Modification of this library https://github.com/umchee/react-double-scrollbar */

const DoubleScrollbar = ({ children }) => {
  const [width, setWidth] = useState("auto");
  const outerDivRef = useRef(null);
  const childrenWrapperRef = useRef(null);

  const calculateWidth = () => {
    const childWrapperWidth = childrenWrapperRef.current?.scrollWidth;
    const newWidth = childWrapperWidth ? `${childWrapperWidth}px` : "auto";
    setWidth(newWidth);
  };

  useEffect(() => {
    const outerDiv = outerDivRef.current;
    const childWrapper = childrenWrapperRef.current;

    if (!outerDiv || !childWrapper) {
      return;
    }

    const syncScroll = () => {
      childWrapper.scrollLeft = outerDiv.scrollLeft;
    };

    const syncReverseScroll = () => {
      outerDiv.scrollLeft = childWrapper.scrollLeft;
    };

    calculateWidth();

    window.addEventListener("resize", calculateWidth);
    outerDiv.addEventListener("scroll", syncScroll);
    childWrapper.addEventListener("scroll", syncReverseScroll);

    return () => {
      window.removeEventListener("resize", calculateWidth);
      outerDiv.removeEventListener("scroll", syncScroll);
      childWrapper.removeEventListener("scroll", syncReverseScroll);
    };
  }, []);

  const outerDivStyle = { overflowX: "auto", overflowY: "hidden" };
  const innerDivStyle = { paddingTop: "1px", width };
  const childDivStyle = { overflow: "auto", overflowY: "hidden" };

  return (
    <div>
      <div ref={outerDivRef} style={outerDivStyle}>
        <div style={innerDivStyle}>&nbsp;</div>
      </div>
      <div ref={childrenWrapperRef} style={childDivStyle}>
        {children}
      </div>
    </div>
  );
};

export default DoubleScrollbar;

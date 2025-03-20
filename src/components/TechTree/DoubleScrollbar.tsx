import { useState, useEffect, useRef, type ReactNode, type CSSProperties } from "react";

/* Modification of this library https://github.com/umchee/react-double-scrollbar */

interface DoubleScrollbarProps {
  children: ReactNode;
}

const DoubleScrollbar = ({ children }: DoubleScrollbarProps) => {
  const [width, setWidth] = useState("auto");
  const outerDivRef = useRef<HTMLDivElement | null>(null);
  const childrenWrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const calculateWidth = () => {
      const childWrapperWidth = childrenWrapperRef.current?.scrollWidth;
      const newWidth = childWrapperWidth ? `${childWrapperWidth}px` : "auto";
      setWidth(newWidth);
    };

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

  const outerDivStyle: CSSProperties = { overflowX: "auto", overflowY: "hidden" };
  const innerDivStyle: CSSProperties = { paddingTop: "1px", width };
  const childDivStyle: CSSProperties = { overflow: "auto", overflowY: "hidden" };

  return (
    <div className="w-full">
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

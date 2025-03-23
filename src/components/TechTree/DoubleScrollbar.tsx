import {
  useState,
  useEffect,
  useRef,
  useCallback,
  type ReactNode,
  type CSSProperties,
} from "react";

/* Modification of this library https://github.com/umchee/react-double-scrollbar */

interface DoubleScrollbarProps {
  children: ReactNode;
}

const DoubleScrollbar = ({ children }: DoubleScrollbarProps) => {
  const [width, setWidth] = useState("auto");
  const outerDivRef = useRef<HTMLDivElement | null>(null);
  const childrenWrapperRef = useRef<HTMLDivElement | null>(null);

  const calculateWidth = useCallback(() => {
    if (!childrenWrapperRef.current) {
      return;
    }

    const childWrapperWidth = childrenWrapperRef.current.scrollWidth;
    const newWidth = childWrapperWidth ? `${childWrapperWidth}px` : "auto";
    setWidth(newWidth);
  }, []);

  const syncScroll = useCallback(() => {
    if (!outerDivRef.current || !childrenWrapperRef.current) {
      return;
    }
    childrenWrapperRef.current.scrollLeft = outerDivRef.current.scrollLeft;
  }, []);

  const syncReverseScroll = useCallback(() => {
    if (!outerDivRef.current || !childrenWrapperRef.current) {
      return;
    }
    outerDivRef.current.scrollLeft = childrenWrapperRef.current.scrollLeft;
  }, []);

  useEffect(() => {
    const outerDiv = outerDivRef.current;
    const childWrapper = childrenWrapperRef.current;

    if (!outerDiv || !childWrapper) {
      return;
    }

    calculateWidth();

    let resizeTimer: number | null = null;
    const handleResize = () => {
      if (resizeTimer) {
        window.clearTimeout(resizeTimer);
      }
      resizeTimer = window.setTimeout(calculateWidth, 100);
    };

    window.addEventListener("resize", handleResize);
    outerDiv.addEventListener("scroll", syncScroll);
    childWrapper.addEventListener("scroll", syncReverseScroll);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (outerDiv) {
        outerDiv.removeEventListener("scroll", syncScroll);
      }
      if (childWrapper) {
        childWrapper.removeEventListener("scroll", syncReverseScroll);
      }
      if (resizeTimer) {
        window.clearTimeout(resizeTimer);
      }
    };
  }, [calculateWidth, syncScroll, syncReverseScroll]);

  const outerDivStyle: CSSProperties = {
    overflowX: "auto",
    overflowY: "hidden",
  };
  const innerDivStyle: CSSProperties = { paddingTop: "1px", width };
  const childDivStyle: CSSProperties = {
    overflow: "auto",
    overflowY: "hidden",
  };

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

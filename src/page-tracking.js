import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ReactGA from "react-ga";

const usePageTracking = () => {
  const location = useLocation();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (
      !window.location.href.includes("localhost") &&
      localStorage.getItem("acceptscookies") &&
      process.env.REACT_APP_GA_ID
    ) {
      ReactGA.initialize(process.env.REACT_APP_GA_ID);
    }
    setInitialized(true);
  }, []);

  useEffect(() => {
    if (
      !window.location.href.includes("localhost") &&
      localStorage.getItem("acceptscookies") &&
      process.env.REACT_APP_GA_ID &&
      initialized
    ) {
      ReactGA.pageview(location.pathname + location.search);
    }
  }, [initialized, location]);
};

export default usePageTracking;

 

// export default ScrollTop;
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollTop;

// import { useEffect } from "react";
// import { useLocation } from "react-router-dom";

// const ScrollToTop = ({ children }: any) => {
//   const location = useLocation();

//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, [location.pathname]);

//   return children;
// };

// export default ScrollToTop;

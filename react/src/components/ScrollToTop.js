import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const usePrevious = (value) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });

  return ref.current;
};

export const ScrollToTop = () => {
  const { pathname } = useLocation();
  const prevPathname = usePrevious(pathname);

  useEffect(() => {
    if (pathname !== prevPathname) {
      window.scrollTo(0, 0);
    }
  });

  return null;
};

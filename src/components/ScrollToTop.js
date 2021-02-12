import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });

  return ref.current;
}

export function ScrollToTop() {
  const { pathname } = useLocation();
  const prevPathname = usePrevious(pathname);

  useEffect(() => {
    if (pathname !== prevPathname) {
      window.scrollTo(0, 0);

      if ((window || {})?.ga) {
        window.ga("set", "page", pathname);
        window.ga("send", "pageview");
      }

      if ((window || {})?.fbq) {
        window.fbq("track", "PageView");
      }
    }
  }, [pathname, prevPathname]);

  return null;
}

export default ScrollToTop;

import React, { useEffect, useRef, useState } from "react";

import scrollHandler from "../../handlers/scroll";

export default function LazyLoad({ children }) {
  const container = useRef();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function scrollDetection({ height }) {
      if (container.current) {
        const bounds = container.current.getBoundingClientRect();

        if (bounds.top - height < 0) {
          setVisible(true);
        }
      }
    }

    scrollHandler.add(scrollDetection);
    scrollDetection({ height: document.documentElement.clientHeight });

    return () => {
      scrollHandler.remove(scrollDetection);
    };
  }, [container]);

  if (!visible) {
    return <div ref={container} />;
  }

  return <div ref={container}>{children}</div>;
}

import React, { forwardRef, createElement } from "react";

import PageWidth from "./PageWidth";

export default forwardRef(
  ({ notHeading, className = "", children, ...props }, ref) => {
    const Wrap = createElement(notHeading ? "div" : "h1", {});
    return (
      <div className={`bg-near-white ${className}`} {...props}>
        <PageWidth>
          <Wrap.type className="title ma0 lh-solid pv4">
            <span className="f4 fw4 db" ref={ref}>
              {children}
            </span>
          </Wrap.type>
        </PageWidth>
      </div>
    );
  }
);

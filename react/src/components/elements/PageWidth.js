import React, { forwardRef } from "react";

const PageWidth = ({ children, className, ...props }, ref) => (
  <div
    className={`w-100 mw8 ph3 center ${className || ""}`}
    {...props}
    ref={ref}
  >
    {children}
  </div>
);

export default forwardRef(PageWidth);

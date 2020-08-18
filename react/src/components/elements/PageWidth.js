import React, { forwardRef } from "react";

export default forwardRef(function PageWidth(
  { children, className, ...props },
  ref
) {
  return (
    <div
      className={`w-100 mw8 ph3 center ${className || ""}`}
      {...props}
      ref={ref}
    >
      {children}
    </div>
  );
});

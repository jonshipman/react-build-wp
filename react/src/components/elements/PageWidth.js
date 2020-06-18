import React, { forwardRef } from 'react';

export default forwardRef(({ children, className, ...rest }, ref) => (
  <div className={`w-100 mw8 ph3 center ${className || ''}`} { ...rest } ref={ref}>
    {children}
  </div>
));
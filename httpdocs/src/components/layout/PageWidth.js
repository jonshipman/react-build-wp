import React from 'react';

export default ({ children, className, ...rest }) => (
  <div className={`w-100 mw8 center ${className || ''}`} { ...rest }>
    {children}
  </div>
);
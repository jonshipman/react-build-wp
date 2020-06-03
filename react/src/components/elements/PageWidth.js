import React from 'react';

export default ({ children, className, ...rest }) => (
  <div className={`w-100 mw8 ph3 center ${className || ''}`} { ...rest }>
    {children}
  </div>
);
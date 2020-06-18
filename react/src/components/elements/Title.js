import React, { forwardRef } from 'react';

import PageWidth from './PageWidth';

const classes = [
  'title ma0 lh-solid pv4',
  'f4 fw4 db'
];

export default forwardRef(({ notHeading, className, children, ...props }, ref) => (
  <div className={`bg-near-white ${className || ''}`} { ...props }>
    <PageWidth>
      {notHeading
      ? (
        <div className={classes[0]}>
          <span className={classes[1]} ref={ref}>{children}</span>
        </div>
      )
      : (
        <h1 className={classes[0]}>
          <span className={classes[1]} ref={ref}>{children}</span>
        </h1>
      )
      }

    </PageWidth>
  </div>
));

import React from 'react';

import PageWidth from './PageWidth';

const classes = [
  'content--title ma0 lh-solid pv4',
  'content--title-inner f4 fw4 db'
];

export default ({ notHeading, className, children, ...rest }) => (
  <div className={`bg-near-white ma0 ${className || ''}`} { ...rest }>
    <PageWidth>
      {notHeading
      ? (
        <div className={classes[0]}>
          <span className={classes[1]}>{children}</span>
        </div>
      )
      : (
        <h1 className={classes[0]}>
          <span className={classes[1]}>{children}</span>
        </h1>
      )
      }

    </PageWidth>
  </div>
)
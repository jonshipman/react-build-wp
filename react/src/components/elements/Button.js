import React from 'react';
import { Link } from 'react-router-dom';

export const PrimaryClasses = 'pointer f6 link bg-animate hover-bg-blue br2 ph4 pv2 mb2 dib white bg-green';
export const SecondaryClasses = 'pointer f6 link dim br2 ph4 pv2 mb2 dib white ba b--white';
export const TertiaryClasses = 'pointer f6 link dim br2 ph4 pv2 mb2 dib green ba b--green';

export default ({ children, className, type, ...rest }) => {
  let classNames = PrimaryClasses;

  if (2 === type) {
    classNames = SecondaryClasses;
  }

  if (3 === type) {
    classNames = TertiaryClasses;
  }

  if (rest.href) {
    return (
      <a className={`${classNames} ${className || ''}`} { ...rest }>
        {children}
      </a>
    );
  }

  if (rest.to) {
    return (
      <Link className={`${classNames} ${className || ''}`} { ...rest }>
        {children}
      </Link>
    );
  }

  return (
    <div className={`${classNames} ${className || ''}`} { ...rest }>
      {children}
    </div>
  );
}
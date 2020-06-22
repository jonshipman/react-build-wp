import React from 'react';
import { Link } from 'react-router-dom';

export const PrimaryClasses = 'pointer f6 link bg-animate hover-bg-blue br2 ph4 pv2 mb2 dib white bg-green';
export const SecondaryClasses = 'pointer f6 link dim br2 ph4 pv2 mb2 dib white ba b--white';
export const TertiaryClasses = 'pointer f6 link dim br2 ph4 pv2 mb2 dib green ba b--green';

export default ({ children, className='', altClasses, type, form=false, to, href, ...props }) => {
  let classNames = PrimaryClasses;

  if (2 === type) {
    classNames = SecondaryClasses;
  }

  if (3 === type) {
    classNames = TertiaryClasses;
  }

  if (altClasses) {
    classNames = altClasses;
  }

  if (href) {
    return (
      <a href={href} className={`${classNames} ${className}`} { ...props }>
        {children}
      </a>
    );
  }

  if (to) {
    return (
      <Link to={to} className={`${classNames} ${className}`} { ...props }>
        {children}
      </Link>
    );
  }

  if (form) {
    return (
      <button className={`${classNames} ${className}`} type="submit" { ...props }>
        {children}
      </button>
    );
  }

  return (
    <div className={`${classNames} ${className}`} { ...props }>
      {children}
    </div>
  );
}
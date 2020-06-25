import React from 'react';
import { Link } from 'react-router-dom';

export const PrimaryClasses = 'pointer link bg-animate hover-bg-blue br2 ph4 pv2 white bg-green bn';
export const SecondaryClasses = 'pointer link dim br2 ph4 pv2 white ba b--white';
export const TertiaryClasses = 'pointer link dim br2 ph4 pv2 green ba b--green';

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

  if (!className.includes('db') && !className.includes('dib')) {
    classNames += ' dib';
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
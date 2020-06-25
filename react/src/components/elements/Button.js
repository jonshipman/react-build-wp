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

  classNames += ` ${className}`;

  if (!classNames.includes('db') && !classNames.includes('dib') && !classNames.includes('flex')) {
    classNames += ' dib';
  }

  if (href) {
    return (
      <a href={href} className={classNames} { ...props }>
        {children}
      </a>
    );
  }

  if (to) {
    return (
      <Link to={to} className={classNames} { ...props }>
        {children}
      </Link>
    );
  }

  if (form) {
    return (
      <button className={classNames} type="submit" { ...props }>
        {children}
      </button>
    );
  }

  return (
    <div className={classNames} { ...props }>
      {children}
    </div>
  );
}
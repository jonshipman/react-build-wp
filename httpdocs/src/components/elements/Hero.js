import React from 'react';
import { isWebpSupported } from '../utils/Browser';

export default ({ after, before, children, background }) => {
  let localBackground = '';

  if (isWebpSupported()) {
    localBackground = '/images/hero-background.webp';
  } else {
    localBackground = '/images/hero-background.jpg';
  }

  if (background) {
    localBackground = background;
  }

  return (
    <div className="hero" style={{backgroundImage: `url(${localBackground})`}}>
      <div className="hero--inner">
        {before && (
          <div className="hero--before">
            {before}
          </div>
        )}
        <div className="hero--section">
          {children}
        </div>

        {after && (
          <div className="hero--after">
            {after}
          </div>
        )}
      </div>
    </div>
  );
}

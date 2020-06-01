import React from 'react';

import Button from './Button';
import { PlacholderUrl } from './Image';

export const HeroSkeleton = ({ className, ...props }) => (
  <div className={`hero bg-light-gray bg-left bg-center-l relative z-1 overflow-hidden ${className || ''}`} { ...props } >
    <div className="tc-l mt4 mt5-m mt6-l ph3">
      <div className="hero--inner relative z-1 pv6">
          <div className="f2 f1-l fw2 white-90 mb0 mt4 h2 w-20 center loading-block" />
          <div className="fw1 f3 white-80 mt3 mb4 h1 w-40 center loading-block" />

          <Button className="v-mid h2" />
      </div>
    </div>
  </div>
);

export default ({ className, heading, subheading, cta, secondaryCta, background }) => (
  <div className={`hero cover bg-left bg-center-l relative z-1 overflow-hidden ${className || ''}`} style={{backgroundImage: `url(${background || PlacholderUrl({ width: 1920, height: 600 })})`}}>
    <div className="tc-l mt4 mt5-m mt6-l ph3">
      <div className="hero--inner relative z-1 pv6">
        {heading && (
          <h1 className="f2 f1-l fw2 white-90 mb0 lh-title text-shadow">{heading}</h1>
        )}
        {subheading && (
          <h2 className="fw1 f3 white-80 mt3 mb4 text-shadow">{subheading}</h2>
        )}

        {cta && (
          <Button to={cta.link} className="v-mid">
            {cta.text}
          </Button>
        )}

        {secondaryCta && (
          <>
            <span className="dib v-mid ph3 white-70 mb3">or</span>
            <Button to={secondaryCta.link} type={2} className="v-mid">
              {secondaryCta.text}
            </Button>
          </>
        )}
      </div>
    </div>
  </div>
);

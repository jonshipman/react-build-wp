import React from "react";

import { PlacholderUrl } from "./Image";
import Button from "./Button";
import useSettings from "../hooks/useSettings";

const Hero = ({ error, className = "", cta, secondaryCta, background }) => {
  let { title: heading, description: subheading } = useSettings();
  if (error) heading = error.message;

  const style = {};

  if (background) {
    style.backgroundImage = `url(${background})`;
  } else {
    style.backgroundImage = `url(${PlacholderUrl({
      width: 1920,
      height: 600,
      seed: "HERO",
    })})`;
  }

  return (
    <div
      className={`hero cover bg-left bg-center-l relative z-1 overflow-hidden bg-light-gray ${className}`}
      style={style}
    >
      <div className="tc-l vh-75 flex items-center ph4">
        <div className="relative z-1 w-100">
          {heading && (
            <h1 className="f2 f1-l fw2 white-90 mb0 lh-title text-shadow">
              {heading}
            </h1>
          )}
          {subheading && (
            <h2 className="fw1 f3 white-80 mt3 mb4 text-shadow">
              {subheading}
            </h2>
          )}

          {cta.text && (
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
};

export default Hero;

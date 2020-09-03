import React from "react";
import { Button as SourceButton } from "react-boilerplate-leadform";

export const ButtonClasses = {
  buttonType1:
    "pointer link bg-animate hover-bg-secondary br2 ph4 pv2 white bg-primary bn",
  buttonType2: "pointer link dim br2 ph4 pv2 white ba b--white",
  buttonType3: "pointer link dim br2 ph4 pv2 primary ba b--primary",
};

const Button = ({ type = 1, className = "", ...props }) => {
  const newProps = { className: "", ...props };

  switch (type) {
    case 1:
      newProps.className = ButtonClasses.buttonType1;
      break;
    case 2:
      newProps.className = ButtonClasses.buttonType2;
      break;
    case 3:
      newProps.className = ButtonClasses.buttonType3;
      break;
    default:
  }

  newProps.className += ` ${className}`;

  return <SourceButton {...newProps} />;
};

export default Button;

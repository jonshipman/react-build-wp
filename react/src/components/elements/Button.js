import React from "react";
import { Link } from "react-router-dom";

import Loading from "./Loading";

export const PrimaryClasses =
  "pointer link bg-animate hover-bg-blue br2 ph4 pv2 white bg-green bn";
export const SecondaryClasses =
  "pointer link dim br2 ph4 pv2 white ba b--white";
export const TertiaryClasses = "pointer link dim br2 ph4 pv2 green ba b--green";

const Button = ({
  children,
  className = "",
  altClasses,
  type,
  form = false,
  to,
  href,
  ...props
}) => {
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

  if (
    !classNames.includes("db") &&
    !classNames.includes("dib") &&
    !classNames.includes("flex")
  ) {
    classNames += " dib";
  }

  if (props.disabled) {
    props.onClick = () => true;
  }

  if (href) {
    return (
      <a href={href} className={classNames} {...props}>
        {children}
      </a>
    );
  }

  if (to) {
    return (
      <Link to={to} className={classNames} {...props}>
        {children}
      </Link>
    );
  }

  if (form) {
    return (
      <button className={classNames} type="submit" {...props}>
        {children}
      </button>
    );
  }

  return (
    <div className={classNames} {...props}>
      {children}
    </div>
  );
};

export default ({ loading, disabled, style = {}, ...props }) => {
  if (loading) {
    return (
      <div
        className={`${
          props?.className?.includes("db") ? "flex" : "inline-flex"
        } justify-between items-center`}
      >
        <Button disabled={true} style={{ ...style, flexGrow: 1 }} {...props} />
        <Loading className="ml3" />
      </div>
    );
  }

  return <Button disabled={disabled} style={style} {...props} />;
};

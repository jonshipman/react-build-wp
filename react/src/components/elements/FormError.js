import React from "react";

const formError = (props) => {
  const { children } = props;
  return <div className="error-message red fw7 f7">{children}</div>;
};

export default formError;

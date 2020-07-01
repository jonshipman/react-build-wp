import React from "react";

export default ({ color, ...props }) => {
  const style = {};
  if (color) {
    style.borderTopColor = color;
  }

  return (
    <span {...props}>
      <span className="lds-ring">
        {Array.from(new Array(3)).map(() => (
          <span style={style} />
        ))}
      </span>
    </span>
  );
};

import React from "react";

const trimString = (str) => {
  if (!str) return str;

  let _str = str.replace(/(<([^>]+)>)/gi, "");
  if (_str.length > 250) {
    _str = _str.substring(0, 250) + "&hellip;";
  }
  return _str;
};

const PostContent = ({ className, content, children, trim = false }) => {
  let text = content || children;
  if (trim) {
    text = trimString(text);
  }

  return (
    <div
      className={`post-content ${className || ""}`}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: text }}
    />
  );
};

export default PostContent;

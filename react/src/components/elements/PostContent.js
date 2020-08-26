import React from "react";

const PostContent = ({ className, content, children }) => (
  <div
    className={`post-content ${className || ""}`}
    // eslint-disable-next-line react/no-danger
    dangerouslySetInnerHTML={{ __html: content || children }}
  />
);

export default PostContent;

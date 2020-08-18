import React from "react";

export default function PostContent({ className, content, children }) {
  return (
    <div
      className={`post-content ${className || ""}`}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: content || children }}
    />
  );
}

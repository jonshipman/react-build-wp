import React from 'react';

export default ({ className, content }) => (
  <div
    className={`post-content ${(className || '')}`}
    // eslint-disable-next-line react/no-danger
    dangerouslySetInnerHTML={{ __html: content }}
  />
);

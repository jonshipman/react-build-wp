import React from 'react';

const PostContent = (props) => (
  <div
    className={`post-content ${(props.className || '')}`}
    // eslint-disable-next-line react/no-danger
    dangerouslySetInnerHTML={{ __html: props.content }}
  />
);

export default PostContent;
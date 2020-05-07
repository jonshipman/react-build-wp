import React from 'react';
import { Link } from 'react-router-dom';

import PostContent from './PostContent';

export default ({ post }) => (
  <article key={post.node.slug} className={`content blog-entry post-${post.node.postId}`}>
      <h2 className="mt5">
        <Link to={post.node.link}>
          {post.node.title}
        </Link>
      </h2>
      <PostContent className="mv4" content={post.node.excerpt || post.node.content} />
      <Link
        to={post.node.link}
        className="round-btn invert ba bw1 pv2 ph3"
      >
        Read more
      </Link>
  </article>
);

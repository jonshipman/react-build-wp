import React from 'react';
import { Link } from 'react-router-dom';

import Button from './Button';
import PostContent from './PostContent';

export default ({ post }) => (
  <article key={post.node.id} className={`content blog-entry post-${post.node.databaseId}`}>
      <h2 className="mt5">
        <Link to={post.node.uri}>
          {post.node.title}
        </Link>
      </h2>
      <PostContent className="mv4" content={post.node.excerpt || post.node.content} />
      <div>
        <Button to={post.node.uri} type={3}>
          Read more
        </Button>
      </div>
  </article>
);

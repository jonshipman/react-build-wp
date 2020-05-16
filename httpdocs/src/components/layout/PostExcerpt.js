import React from 'react';
import { Link } from 'react-router-dom';

import Button from '../elements/Button';
import PostContent from '../elements/PostContent';

export default ({ post }) => (
  <article key={post.node.slug} className={`content blog-entry post-${post.node.postId}`}>
      <h2 className="mt5">
        <Link to={post.node.link}>
          {post.node.title}
        </Link>
      </h2>
      <PostContent className="mv4" content={post.node.excerpt || post.node.content} />
      <div>
        <Button to={post.node.link} type={3}>
          Read more
        </Button>
      </div>
  </article>
);

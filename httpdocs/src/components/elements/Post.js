import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from "react-helmet";
import PostContent from './PostContent';
import { FRONTEND_URL } from '../../constants';

const Post = (props) => (
  <>
    <Helmet>
      <title>{props.post.seo.title}</title>
      <meta name="description" content={props.post.seo.metaDesc}/>
      <link rel="canonical" href={`${FRONTEND_URL}/${props.post.slug}`} />
    </Helmet>
    <article className={`content post-${props.post.postId}`}>
      {props.post.mainTitle && (
        <div className="content--title f1 tc mb4">
          <span className="content--title-inner">{props.post.mainTitle}</span>
        </div>
      )}

      <div className="content--body">
        <h1 className="content--body-post-title f2 fw4 mb4">{props.post.title}</h1>

        <div className="post-meta mv4">
          <div className="posted dib mr4"><span>{props.post.date}</span></div>

          <div className="post-categories dib">
            {props.post.categories.edges && (
              <>
                <ul className="list pl0 dib">
                  {props.post.categories.edges.map(category => (
                    <li key={`cat-${category.node.categoryId}-post-cats`} className="dib mr2 pr2 br b--near-white">
                      <Link to={`/blog/${category.node.slug}`}>
                        {category.node.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>

        <PostContent content={props.post.content}/>
      </div>
    </article>
  </>
);

export default Post;

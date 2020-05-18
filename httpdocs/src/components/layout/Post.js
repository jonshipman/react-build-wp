import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import PostContent from '../elements/PostContent';
import PageWidth from '../layout/PageWidth';
import Title from '../layout/Title';

import { FRONTEND_URL } from '../../constants';

export default props => (
  <>
    <Helmet>
      <title>{props.post.seo.title}</title>
      <meta name="description" content={props.post.seo.metaDesc}/>
      <link rel="canonical" href={`${FRONTEND_URL}/${props.post.slug}`} />
    </Helmet>
    <article className={`content post-${props.post.postId}`}>
      {props.post.mainTitle && (
        <Title notHeading={true}>{props.post.mainTitle}</Title>
      )}

      <PageWidth className="content--body">
        <h1 className="content--body-post-title f2 fw4 mb4">{props.post.title}</h1>

        <div className="post-meta mv4">
        <div className="posted dib mr4"><span>{props.post.dateFormatted}</span></div>

        <div className="post-categories dib">
            {props.post.categories.edges && (
              <>
                <ul className="list pl0 dib">
                  {props.post.categories.edges.map(category => (
                    <li key={`cat-${category.node.categoryId}-post-cats`} className="dib mr2 pr2 br b--near-white drop-last-br">
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
      </PageWidth>
    </article>
  </>
);

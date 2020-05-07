import React from 'react';
import { Helmet } from 'react-helmet';

import PostContent from './PostContent';
import Style from './Style';

import { FRONTEND_URL } from '../../constants';

export default props => (
  <>
    <Helmet>
      <title>{props.page.seo.title}</title>
      <meta name="description" content={props.page.seo.metaDesc}/>
      <link rel="canonical" href={`${FRONTEND_URL}/${props.page.slug}`} />
    </Helmet>
    {props.page.wpbCustomCss && (
      <Style style={props.page.wpbCustomCss}/>
    )}
    <article className={`content post-${props.page.databaseId}`}>
      {props.page.title && (
        <h1 className="content--title f1 tc mb4">
          <span className="content--title-inner">{props.page.title}</span>
        </h1>
      )}

      <div className="content--body">
        <PostContent content={props.page.content}/>
      </div>
    </article>
  </>
);

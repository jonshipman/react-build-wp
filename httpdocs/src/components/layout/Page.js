import React from 'react';
import { Helmet } from 'react-helmet';

import PostContent from '../elements/PostContent';
import PageWidth from '../layout/PageWidth';
import Title from '../layout/Title';

import { FRONTEND_URL } from '../../constants';

export default props => (
  <>
    <Helmet>
      <title>{props.page.seo.title}</title>
      <meta name="description" content={props.page.seo.metaDesc}/>
      <link rel="canonical" href={`${FRONTEND_URL}/${props.page.slug}`} />
    </Helmet>

    <article className={`content post-${props.page.databaseId}`}>
      {props.page.title && (
        <Title>{props.page.title}</Title>
      )}

      <PageWidth className="content--body">
        <PostContent content={props.page.content}/>
      </PageWidth>
    </article>
  </>
);

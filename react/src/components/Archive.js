import React, { useState } from 'react';
import { Helmet } from "react-helmet";
import { gql, useQuery } from '@apollo/client';

import { FRONTEND_URL } from '../config';
import Button from './elements/Button';
import Loading from './elements/Loading';
import LoadingError from './elements/LoadingError';
import PageWidth from './elements/PageWidth';
import PostExcerpt from './elements/PostExcerpt';
import Title from './elements/Title';

const ARCHIVE_QUERY = gql`
  query ArchiveQuery(
    $first: Int,
    $last: Int,
    $after: String,
    $before: String
  ) {
    posts(
      first: $first,
      last: $last,
      after: $after,
      before: $before,
      where: { status: PUBLISH, hasPassword: false }
    ) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
        node {
          id
          databaseId
          title
          uri
          excerpt
          dateFormatted
        }
      }
    }
  }
`;

const NEXT = 1;
const PREV = -1;
const postsPerPage = 10;
const initialState = {
  pageInfo: {
    hasNextPage: false,
    hasPreviousPage: false,
    startCursor: '',
    endCursor: ''
  }
};

const OnQueryFinished = ({
  posts,
  setDirection,
  setPageInfo,
}) => {
  if (posts?.edges?.length < 1) {
    return (
      <PageWidth>
        Nothing found.
      </PageWidth>
    );
  }

  return (
    <PageWidth className="archives">
      {posts?.edges?.length > 0 && (
        <div className="cf mb3">
          <div className="blog-entries mb3">
            {posts.edges.map(post => (
              <PostExcerpt key={`archive-${post.node.databaseId}`} post={post} />
            ))}
          </div>

          {posts.pageInfo?.hasPreviousPage && (
            <Button className="fl" onClick={() => {
              setPageInfo(posts.pageInfo);
              setDirection(PREV);
              window.scrollTo(0, 0);
            }}>
              Previous
            </Button>
          )}

          {posts.pageInfo?.hasNextPage && (
            <Button className="fr" onClick={() => {
              setPageInfo(posts.pageInfo);
              setDirection(NEXT);
              window.scrollTo(0, 0);
            }}>
              Next
            </Button>
          )}
        </div>
      )}
    </PageWidth>
  );
}

const DefaultQuery = ({ variables, children }) => {
  const { loading, error, data } = useQuery(ARCHIVE_QUERY, { variables });

  if (loading) return <Loading />
  if (error) return <LoadingError error={error.message} />

  return children(data);
}

const PostsAndQuery = ({ NewQuery, ...props }) => {
  const [ direction, setDirection ] = useState(0);
  const [ pageInfo, setPageInfo ] = useState(initialState.pageInfo);

  let variables = {
    first: postsPerPage
  };

  if (NEXT === direction) {
    variables.after = pageInfo.endCursor;
    variables.first = postsPerPage;
    variables.before = null;
    variables.last = null;
  }

  if (PREV === direction) {
    variables.after = null;
    variables.first = null;
    variables.before = pageInfo.startCursor;
    variables.last = postsPerPage;
  }

  const ExecuteQuery = NewQuery || DefaultQuery;

  return (
    <ExecuteQuery variables={variables}>
      {data => (
        <OnQueryFinished
          { ...data }
          { ...props }
          setDirection={setDirection}
          setPageInfo={setPageInfo}
        />
      )}
    </ExecuteQuery>
  );
}

const DefaultSeo = ({ title }) => (
  <Helmet>
    <title>{title || 'Blog'}</title>
    <link rel="canonical" href={`${FRONTEND_URL}/blog`} />
  </Helmet>
);

export default ({ className='blog', children, title='Blog', Seo=DefaultSeo, ...props }) => {
  return (
    <div className={className}>
      {Seo && <Seo />}

      {title && <Title>{title}</Title>}

      {children && (
        <PageWidth>
          {children}
        </PageWidth>
      )}

      <PostsAndQuery
        title={title}
        { ...props }
        />
    </div>
  );
}

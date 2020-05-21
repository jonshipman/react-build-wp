import React from 'react';
import { gql, useQuery } from '@apollo/client';

import NotFound from './layout/NotFound';
import Page from './layout/Page';
import Post from './layout/Post';
import PageSkeleton from './layout/PageSkeleton';
import LoadingError from './elements/LoadingError';
import PageWidth from './layout/PageWidth';

/**
 * GraphQL page query that takes a page slug as a uri
 * Returns the title and content of the page
 */
const POST_QUERY = gql`
  query PageQuery($uri: String!) {
    pageBy(uri: $uri) {
      databaseId
      slug
      title
      content
      pageTemplate
      seo {
        title
        metaDesc
      }
    }
    postBy(uri: $uri) {
      databaseId
      slug
      title
      content
      dateFormatted
      seo {
        title
        metaDesc
      }
      categories(first: 5) {
        edges {
          node {
            categoryId
            slug
            name
          }
        }
      }
    }
  }
`;

/**
 * Performs data transforms.
 */
const sanitizeData = data => {
  let page = {};
  let post = {};

  if (data.pageBy) {
    page = data.pageBy;
  }

  if (data.postBy) {
    post = {};
    Object.entries(data.postBy).map(([key, value]) => {
      post[key] = value;

      return null;
    });

    if (post.categories.edges) {
      post.mainTitle = post.categories.edges[0].node.name;
    }
  }

  return {
    page,
    post
  }
}

export default props => {
  const { match } = props;
  let uri = match.url;

  const { loading, error, data } = useQuery(POST_QUERY, { variables: { uri } });

  if (loading) return <PageSkeleton />
  if (error) return <LoadingError error={error.message} />;

  const { page, post } = sanitizeData(data);

  if (page.databaseId) {
    return <Page page={page} />
  }

  if (post.databaseId) {
    return <Post post={post} />
  }

  return (
    <PageWidth>
      <NotFound />
    </PageWidth>
  );
}

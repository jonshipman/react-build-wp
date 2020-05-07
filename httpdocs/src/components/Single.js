import React from 'react';
import { gql, useQuery } from '@apollo/client';
import NotFound from './elements/NotFound';
import Page from './elements/Page';
import Post from './elements/Post';
import Loading from './elements/Loading';
import LoadingError from './elements/LoadingError';

/**
 * GraphQL page query that takes a page slug as a uri
 * Returns the title and content of the page
 */
const POST_QUERY = gql`
  query PageQuery($uri: String!) {
    pageBy(uri: $uri) {
      pageId
      slug
      title(format: RENDERED)
      content(format: RENDERED)
      wpbCustomCss
      pageTemplate
      seo {
        title
        metaDesc
      }
    }
    postBy(uri: $uri) {
      postId
      slug
      title(format: RENDERED)
      content(format: RENDERED)
      wpbCustomCss
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

const initialPage = {
  databaseId: 0,
  title: '',
  content: '',
  seo: {
    title: '',
    metaDesc: ''
  },
  wpbCustomCss: '',
  pageTemplate: '',
};

const initialPost = {
  databaseId: 0,
  title: '',
  content: '',
  seo: {
    title: '',
    metaDesc: ''
  },
  wpbCustomCss: '',
  dateFormatted: '',
  categories: {
    edges: []
  },
  mainTitle: ''
};

const sanitizeData = data => {
  let page = {};
  let post = {};

  if (data.pageBy) {
    page = {};
    Object.entries(data.pageBy).map(([key, value]) => {
      page[key] = JSON.parse(JSON.stringify(value));

      return null;
    });
    page.databaseId = page.pageId;

    post = initialPost;
  }

  if (data.postBy) {
    post = {};
    Object.entries(data.postBy).map(([key, value]) => {
      post[key] = value;

      return null;
    });
    post.databaseId = post.postId;

    if (post.categories.edges) {
      post.mainTitle = post.categories.edges[0].node.name;
    }

    page = initialPage;
  }

  return {
    page,
    post
  }
}

export default props => {
  const { match } = props;
  let uri = match.url;

  if (!uri) {
    uri = '404';
  } else {
    uri = match.url.replace(/^\//, '');
  }

  const { loading, error, data } = useQuery(POST_QUERY, { variables: { uri } });

  if (loading) return <Loading />;
  if (error) return <LoadingError error={error.message} />;

  const { page, post } = sanitizeData(data);

  if (page.databaseId) {
    return <Page page={page} />
  }

  if (post.databaseId) {
    return <Post post={post} />
  }

  return <NotFound />
}

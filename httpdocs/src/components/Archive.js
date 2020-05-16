import React, { useState } from 'react';
import { Helmet } from "react-helmet";
import { gql, useQuery } from '@apollo/client';

import Title from './layout/Title';
import NotFound from './layout/NotFound';
import PageWidth from './layout/PageWidth';
import PostExcerpt from './layout/PostExcerpt';

import Loading from './elements/Loading';
import LoadingError from './elements/LoadingError';

import { FRONTEND_URL } from '../constants';

/**
 * GraphQL category query that takes a category slug as a filter
 * Returns the posts belonging to the category and the category name and ID
 */
const CATEGORY_QUERY = gql`
  query CategoryQuery(
    $filter: String!,
    $first: Int,
    $last: Int,
    $after: String,
    $before: String
  ) {
    posts(first: $first, last: $last, after: $after, before: $before, where: { categoryName: $filter, status: PUBLISH }) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
        node {
          title
          slug
          excerpt
          postId
          dateFormatted
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
    }
    categories(where: { slug: [$filter] }) {
      edges {
        node {
          name
          categoryId
          slug
          seo {
            metaDesc
            title
          }
        }
      }
    }
  }
`;

const ARCHIVE_QUERY = gql`
  query ArchiveQuery(
    $first: Int,
    $last: Int,
    $after: String,
    $before: String
  ) {
    posts(first: $first, last: $last, after: $after, before: $before, where: { status: PUBLISH }) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
        node {
          title
          slug
          excerpt
          postId
          dateFormatted
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
    }
  }
`;

const NEXT = 1;
const PREV = -1;
const postsPerPage = 6;
const initialState = {
  pageInfo: {
    hasNextPage: false,
    hasPreviousPage: false,
    startCursor: '',
    endCursor: ''
  }
};

const OnQueryFinished = ({ pageInfo, category, setDirection, setPageInfo }) => (
  <>
    <Helmet>
      <title>{category.seo ? category.seo.title : 'Blog'}</title>
      {category.seo && <meta name="description" content={category.seo.metaDesc}/>}
      {category.slug && <link rel="canonical" href={`${FRONTEND_URL}/blog/${category.slug}`} />}
    </Helmet>
    <div className="blog-archives content">
      <Title>{category.name || 'Blog'}</Title>

      {category.posts && (
        <PageWidth className="content--body cf">
          <div className="blog-entries">
            {category.posts.map(post => (
              <PostExcerpt key={`archive-${post.node.postId}`} post={post} />
            ))}
          </div>

          {pageInfo.hasPreviousPage && (
            <div className="theme-button fl" onClick={() => {
              setPageInfo(pageInfo);
              setDirection(PREV);
              window.scrollTo(0, 0);
            }}>
              Previous
            </div>
          )}

          {pageInfo.hasNextPage && (
            <div className="theme-button fr" onClick={() => {
              setPageInfo(pageInfo);
              setDirection(NEXT);
              window.scrollTo(0, 0);
            }}>
              Next
            </div>
          )}
        </PageWidth>
      )}
    </div>
  </>
);

const sanitizeData = data => {
  let sPageInfo = {};
  let sCategory = {};

  if (data.categories && data.categories.edges.length > 0) {
    const { name, seo, slug } = data.categories.edges[0].node;

    sCategory = {
      name,
      seo,
      slug
    };
  }

  let posts = [];
  if (data.posts.edges) {
    data.posts.edges.map(post => {
      const finalLink = `/${post.node.slug}`;
      const modifiedPost = {node:{}};
      Object.entries(post.node).map(([key, value]) => {
        modifiedPost.node[key] = value;

        return null;
      });
      modifiedPost.node.link = finalLink;
      posts.push(modifiedPost);

      return null;
    });

    sPageInfo = data.posts.pageInfo;
    sCategory.posts = posts;
  }

  return {
    sPageInfo,
    sCategory
  };
}

export default props => {
  const [ direction, setDirection ] = useState(0);
  const [ pageInfo, setPageInfo ] = useState(initialState.pageInfo);
  const { match, allPosts } = props;
  let query;

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

  if (match) {
    variables.filter = match.params.category;
    query = CATEGORY_QUERY;
  }

  if (allPosts) {
    // slug = match.url.replace(/^\//, '');
    query = ARCHIVE_QUERY;
  }

  const { loading, error, data } = useQuery(query, { variables });

  if (loading) return <Loading />;
  if (error) return <LoadingError error={error.message} />;

  const { sPageInfo, sCategory } = sanitizeData(data);

  if (sCategory.posts.length > 0) {
    return (
      <OnQueryFinished
        category={sCategory}
        pageInfo={sPageInfo}
        setDirection={setDirection.bind(this)}
        setPageInfo={setPageInfo.bind(this)}
      />
    );
  }

  return <NotFound />;
}

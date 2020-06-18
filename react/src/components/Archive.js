import React, { useState, useRef, forwardRef } from 'react';
import { Helmet } from "react-helmet";
import { gql, useQuery } from '@apollo/client';

import { FRONTEND_URL } from '../config';
import Button, { PrimaryClasses } from './elements/Button';
import Loading from './elements/Loading';
import LoadingError from './elements/LoadingError';
import PageWidth from './elements/PageWidth';
import PostExcerpt from './elements/PostExcerpt';
import Title from './elements/Title';

const SEARCH_QUERY = gql`
  query SearchQuery(
    $filter: String!,
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
      where: { search: $filter, status: PUBLISH, hasPassword: false }
    ) {
      edges {
        node {
          id
          postId
          title
          uri
          excerpt
          dateFormatted
        }
      }
    }
  }
`;

const CATEGORY_QUERY = gql`
  query CategoryQuery(
    $filter: String!,
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
      where: { categoryName: $filter, status: PUBLISH, hasPassword: false }
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
          categories(first: 5) {
            edges {
              node {
                id
                databaseId
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
          id
          databaseId
          name
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
          categories(first: 5) {
            edges {
              node {
                id
                databaseId
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
const postsPerPage = 10;
const initialState = {
  pageInfo: {
    hasNextPage: false,
    hasPreviousPage: false,
    startCursor: '',
    endCursor: ''
  }
};

const SearchForm = forwardRef(({ setFilter, className }, ref) => {
  const field = useRef();

  const executeSearch = () => {
    if (field.current) {
      setFilter(field.current.value);

      console.log(`Searched for ${field.current.value}`);
    }
  }

  return (
    <div className={`search ${className || ''}`} ref={ref}>
      <input
        ref={field}
        className="db w-100 pa3 mv3 br6 ba b--black"
        type="text"
        placeholder="Search by name and content"
        onChange={e => e.target.value?.length > 1 && executeSearch()}
        onKeyDown={e => 'Enter' === e.key && executeSearch()}
      />
      <button
        className={`bn ${PrimaryClasses}`}
        type="button"
        onClick={() => executeSearch()}
      >
        Submit
      </button>
    </div>
  );
});

const OnQueryFinished = ({
  categories,
  posts,
  setDirection,
  setPageInfo,
  pageTitle,
}) => {
  const category = categories?.edges?.length > 0 ? categories.edges[0].node : null;

  if (category && pageTitle.current) {
    pageTitle.current.innerHTML = category.name;
  }

  return (
    <div className="archives">
      <Helmet>
        <title>{category?.seo?.title || 'Blog'}</title>
        {category?.seo && <meta name="description" content={category.seo.metaDesc}/>}
        {category?.slug ? <link rel="canonical" href={`${FRONTEND_URL}/blog/${category.slug}`} /> : <link rel="canonical" href={`${FRONTEND_URL}/blog`} />}
      </Helmet>

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
    </div>
  );
}

const PostsAndQuery = ({ match, pageTitle, searchContainer, filter }) => {
  const [ direction, setDirection ] = useState(0);
  const [ pageInfo, setPageInfo ] = useState(initialState.pageInfo);
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

  if (match?.params?.category) {
    variables.filter = match.params.category;
    query = CATEGORY_QUERY;
  } else {
    if (match?.path?.includes('blog')) {
      query = ARCHIVE_QUERY;

      if (pageTitle.current) {
        pageTitle.current.innerHTML = 'Blog';
      }
    }

    if (match?.path?.includes('search')) {
      query = SEARCH_QUERY;
      variables.filter = filter || '';

      if (pageTitle.current) {
        pageTitle.current.innerHTML = 'Search';
      }

      if (searchContainer.current) {
        searchContainer.current.style.display = 'block';
      }
    }
  }

  const { loading, error, data } = useQuery(query, { variables });

  if (loading) return <Loading />
  if (error) return <LoadingError error={error.message} />

  if (SEARCH_QUERY === query && !filter) {
    return null;
  }

  if (data?.posts?.edges?.length < 1) {
    return (
      <div>
        Nothing found.
      </div>
    );
  }

  return (
    <OnQueryFinished
      { ...data }
      setDirection={setDirection}
      setPageInfo={setPageInfo}
      pageTitle={pageTitle}
    />
  );
}

export default props => {
  const pageTitle = useRef();
  const searchContainer = useRef();
  const [filter, setFilter] = useState();

  return (
    <div className="archives">
      <Title ref={pageTitle} />

      <PageWidth>
        <SearchForm ref={searchContainer} className="dn" setFilter={setFilter} />

        <PostsAndQuery
          pageTitle={pageTitle}
          searchContainer={searchContainer}
          filter={filter}
          { ...props }
          />
      </PageWidth>
    </div>
  );
}

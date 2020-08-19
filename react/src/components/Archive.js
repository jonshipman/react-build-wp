import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { gql, useQuery } from "@apollo/client";

import Button from "./elements/Button";
import Loading from "./elements/Loading";
import LoadingError from "./elements/LoadingError";
import PageWidth from "./elements/PageWidth";
import PostContent from "./elements/PostContent";
import Title from "./elements/Title";
import Seo from "./elements/Seo";

const ARCHIVE_QUERY = gql`
  query ArchiveQuery($first: Int, $last: Int, $after: String, $before: String) {
    posts(
      first: $first
      last: $last
      after: $after
      before: $before
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
          content
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
    startCursor: "",
    endCursor: "",
  },
};

function OnQueryFinished({ posts, setDirection, setPageInfo }) {
  if (posts?.edges?.length < 1) {
    return <PageWidth>Nothing found.</PageWidth>;
  }

  return (
    <PageWidth className="entries">
      {posts?.edges?.length > 0 && (
        <div className="entry cf mb3">
          <div className="blog-entries mb3">
            {posts.edges.map((post) => (
              <article
                key={post.node.id}
                className={`content blog-entry post-${post.node.databaseId}`}
              >
                <h2>
                  <Link to={post.node.uri}>{post.node.title}</Link>
                </h2>
                <PostContent
                  className="mv4"
                  content={
                    post.node.excerpt ||
                    post?.node?.content
                      ?.replace(/(<([^>]+)>)/gi, "")
                      .substring(0, 250) + "&hellip;"
                  }
                />
                <div>
                  <Button to={post.node.uri} type={3}>
                    Read more
                  </Button>
                </div>
              </article>
            ))}
          </div>

          {posts.pageInfo?.hasPreviousPage && (
            <Button
              className="fl"
              onClick={() => {
                setPageInfo(posts.pageInfo);
                setDirection(PREV);
                window.scrollTo(0, 0);
              }}
            >
              Previous
            </Button>
          )}

          {posts.pageInfo?.hasNextPage && (
            <Button
              className="fr"
              onClick={() => {
                setPageInfo(posts.pageInfo);
                setDirection(NEXT);
                window.scrollTo(0, 0);
              }}
            >
              Next
            </Button>
          )}
        </div>
      )}
    </PageWidth>
  );
}

function DefaultQuery({ variables, children }) {
  const { loading, error, data } = useQuery(ARCHIVE_QUERY, { variables });

  if (loading)
    return (
      <PageWidth className="mv4">
        <Loading />
      </PageWidth>
    );
  if (error)
    return (
      <PageWidth className="mv4">
        <LoadingError error={error.message} />
      </PageWidth>
    );

  return (
    <>
      <Title>Blog</Title>

      <Seo title="Blog" canonical="/blog" />

      {children(data)}
    </>
  );
}

function PostsAndQuery({ Query = DefaultQuery, ...props }) {
  const [direction, setDirection] = useState(0);
  const [pageInfo, setPageInfo] = useState(initialState.pageInfo);

  let variables = {
    first: postsPerPage,
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

  return (
    <Query variables={variables}>
      {(data) => (
        <OnQueryFinished
          {...data}
          {...props}
          setDirection={setDirection}
          setPageInfo={setPageInfo}
        />
      )}
    </Query>
  );
}

export default function Archive({ className = "archive", children, ...props }) {
  return (
    <div className={className}>
      {children && children}

      <Helmet>
        <meta name="robots" content="noindex" />
      </Helmet>

      <PostsAndQuery {...props} />
    </div>
  );
}

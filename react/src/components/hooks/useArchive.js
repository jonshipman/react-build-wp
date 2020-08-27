import { useCallback, useState } from "react";
import { gql, useQuery } from "@apollo/client";

import { FragmentSeo } from "../elements/Seo";
import { FragmentPost } from "./useSingle";

export const FragmentPageInfo = gql`
  fragment edgePageInfo on WPPageInfo {
    endCursor
    hasNextPage
    hasPreviousPage
    startCursor
  }
`;

const QUERY = gql`
  query ArchiveHook($first: Int, $last: Int, $after: String, $before: String) {
    posts(
      first: $first
      last: $last
      after: $after
      before: $before
      where: { status: PUBLISH, hasPassword: false }
    ) {
      edges {
        node {
          ...postInfo
        }
      }
      pageInfo {
        ...edgePageInfo
      }
    }
  }
  ${FragmentPageInfo}
  ${FragmentSeo}
  ${FragmentPost}
`;

const useArchive = () => {
  const [cursor, setCursor] = useState();
  const [direction, setDirection] = useState();
  const variables = {};

  if (!direction) {
    variables.first = 10;
  } else if (direction < 0) {
    variables.last = 10;
    variables.before = cursor;
  } else if (direction > 0) {
    variables.first = 10;
    variables.after = cursor;
  }

  const { data, loading, error } = useQuery(QUERY, {
    variables,
    errorPolicy: "all",
  });

  const edges = data?.posts?.edges?.length ? data.posts.edges : [];
  const {
    endCursor = "",
    hasNextPage = false,
    hasPreviousPage = false,
    startCursor = "",
  } = data?.posts?.pageInfo || {};

  const goNext = useCallback(() => {
    setDirection(1);
    setCursor(endCursor);
    window.scrollTo(0, 0);
  }, [setDirection, setCursor, endCursor]);

  const goPrev = useCallback(() => {
    setDirection(-1);
    setCursor(startCursor);
    window.scrollTo(0, 0);
  }, [setDirection, setCursor, startCursor]);

  return {
    edges,
    loading,
    error,
    goNext,
    goPrev,
    hasNextPage,
    hasPreviousPage,
  };
};

export default useArchive;

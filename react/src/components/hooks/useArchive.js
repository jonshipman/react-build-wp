import { gql, useQuery } from "@apollo/client";

import {
  FragmentSeo,
  FragmentCategory,
  FragmentPost,
  FragmentPageInfo,
} from "../gql/fragments";
import usePagination, { getPageInfo, useNavigation } from "./usePagination";

const DEFAULT_QUERY = gql`
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
  ${FragmentSeo}
  ${FragmentCategory}
  ${FragmentPageInfo}
  ${FragmentPost}
`;

const useArchive = (props = {}) => {
  const { QUERY = DEFAULT_QUERY, variables: propVariables = {} } = props;
  const { variables, goNext, goPrev } = usePagination();

  const { data, loading, error } = useQuery(QUERY, {
    variables: { ...variables, ...propVariables },
    errorPolicy: "all",
  });

  const edges = data?.posts?.edges?.length ? data.posts.edges : [];
  const { endCursor, hasNextPage, hasPreviousPage, startCursor } = getPageInfo(
    data?.posts?.pageInfo
  );

  const { prev, next } = useNavigation({
    endCursor,
    startCursor,
    goNext,
    goPrev,
  });

  return {
    edges,
    loading,
    error,
    next,
    prev,
    hasNextPage,
    hasPreviousPage,
    data,
  };
};

export default useArchive;

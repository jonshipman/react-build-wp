import { useState } from "react";
import { gql, useQuery } from "@apollo/client";

import { FragmentSeo } from "../elements/Seo";
import { FragmentPost } from "./useSingle";
import usePagination, {
  FragmentPageInfo,
  getPageInfo,
  useNavigation,
} from "./usePagination";

const QUERY = gql`
  query SearchHook(
    $filter: String!
    $first: Int
    $last: Int
    $after: String
    $before: String
  ) {
    posts(
      first: $first
      last: $last
      after: $after
      before: $before
      where: { search: $filter, status: PUBLISH, hasPassword: false }
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

const useSearch = () => {
  const [filter, setFilter] = useState("");
  const { variables, goNext, goPrev } = usePagination();

  variables.filter = filter;

  const { data, loading, error } = useQuery(QUERY, {
    variables,
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
    setFilter,
    filter,
    edges,
    loading,
    error,
    next,
    prev,
    hasNextPage,
    hasPreviousPage,
  };
};

export default useSearch;

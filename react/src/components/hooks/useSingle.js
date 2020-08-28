import { useLocation } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";

import {
  FragmentSeo,
  FragmentCategory,
  FragmentContentNode,
  FragmentPost,
  FragmentPage,
} from "../gql/fragments";

const QUERY = gql`
  query SingleHook($uri: ID!) {
    contentNode(id: $uri, idType: URI) {
      ...contentInfo
      ... on Post {
        ...postInfo
      }
      ... on Page {
        ...pageInfo
      }
    }
  }
  ${FragmentSeo}
  ${FragmentCategory}
  ${FragmentContentNode}
  ${FragmentPost}
  ${FragmentPage}
`;

const QUERY_BY_ID = gql`
  query SingleByIdHook($databaseId: ID!) {
    contentNode(id: $databaseId, idType: DATABASE_ID) {
      ...contentInfo
      ... on Post {
        ...postInfo
      }
      ... on Page {
        ...pageInfo
      }
    }
  }
  ${FragmentSeo}
  ${FragmentCategory}
  ${FragmentContentNode}
  ${FragmentPost}
  ${FragmentPage}
`;

const useSingle = (props = {}) => {
  const { ssr = true, databaseId, uri: passedUri } = props;
  const { pathname: uri } = useLocation();
  const variables = {};
  let q = QUERY;

  if (databaseId) {
    variables.databaseId = databaseId;
    q = QUERY_BY_ID;
  } else {
    if (passedUri) {
      variables.uri = passedUri.replace(/\/+$/, "");
    } else {
      variables.uri = uri.replace(/\/+$/, "");
    }
  }

  const { data, loading, error } = useQuery(q, {
    variables,
    errorPolicy: "all",
    ssr,
  });

  return {
    node: data?.contentNode || {},
    loading,
    error,
  };
};

export default useSingle;

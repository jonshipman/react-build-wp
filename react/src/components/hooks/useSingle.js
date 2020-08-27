import { useLocation } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";

import { FragmentSeo } from "../elements/Seo";

export const FragmentPost = gql`
  fragment postInfo on Post {
    id
    databaseId
    title
    uri
    excerpt
    content
    dateFormatted
    seo {
      ...seoInfo
    }
    categories(first: 5) {
      edges {
        node {
          id
          databaseId
          slug
          name
          uri
        }
      }
    }
  }
`;

const FragmentPage = gql`
  fragment pageInfo on Page {
    id
    title
    content
    pageTemplate
    seo {
      ...seoInfo
    }
  }
`;

const FragmentContentNode = gql`
  fragment contentInfo on ContentNode {
    id
    databaseId
    isRestricted
    isPreview
    slug
    __typename
  }
`;

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
  ${FragmentContentNode}
  ${FragmentSeo}
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
  ${FragmentContentNode}
  ${FragmentSeo}
  ${FragmentPost}
  ${FragmentPage}
`;

const useSingle = (props = {}) => {
  const { ssr = true, databaseId } = props;
  const { pathname: uri } = useLocation();
  const variables = {};
  let q = QUERY;

  if (databaseId) {
    variables.databaseId = databaseId;
    q = QUERY_BY_ID;
  } else {
    variables.uri = uri;
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

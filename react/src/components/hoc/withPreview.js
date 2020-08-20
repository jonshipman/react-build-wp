import React from "react";
import { useLocation, useParams, Redirect } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";

import Config from "../../config";
import Loading from "../elements/Loading";
import LoadingError from "../elements/LoadingError";
import NotFound from "../elements/NotFound";

const PREVIEW_QUERY = gql`
  query SingleQuery($postId: ID!) {
    contentNode(id: $postId, idType: DATABASE_ID) {
      id
      databaseId
      slug
      __typename
      ... on Post {
        id
        dateFormatted
        title
        content
        seo {
          title
          metaDesc
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
      ... on Page {
        id
        title
        content
        seo {
          title
          metaDesc
        }
        pageTemplate
      }
    }
  }
`;

const PreviewQuery = ({ children }) => {
  const { revisionId } = useParams();
  const { pathname } = useLocation();

  const { loading, error, data } = useQuery(PREVIEW_QUERY, {
    variables: { postId: revisionId },
  });

  if (loading) return <Loading />;
  if (error) return <LoadingError error={error.message} />;

  const obj = Object.assign({}, data?.contentNode);

  if (obj.isRestricted) {
    Config.removeAuthToken();
    Config.setRedirect(pathname);
    return <Redirect to="/login" />;
  }

  if (obj) {
    return children(obj);
  }

  return <NotFound />;
};

export default (WrappedComponent) => {
  return (props) => {
    return <WrappedComponent Query={PreviewQuery} {...props} />;
  };
};

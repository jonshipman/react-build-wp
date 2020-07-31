import React from "react";
import { useLocation, useParams, Redirect } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";

import Config from "../../config";
import Loading from "../elements/Loading";
import LoadingError from "../elements/LoadingError";
import NotFound from "../elements/NotFound";

const PREVIEW_QUERY = gql`
  query SingleQuery($postId: ID!) {
    post(id: $postId, idType: DATABASE_ID) {
      databaseId
      slug
      title
      content
      dateFormatted
      isRestricted
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
    page(id: $postId, idType: DATABASE_ID) {
      databaseId
      slug
      title
      content
      pageTemplate
      isRestricted
      seo {
        title
        metaDesc
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

  const obj = Object.assign({}, data.page || data.post);

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
  return () => <WrappedComponent Query={PreviewQuery} {...this.props} />;
};

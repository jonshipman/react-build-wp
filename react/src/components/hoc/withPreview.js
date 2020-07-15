import React, { Component } from "react";
import { withRouter } from "react-router-dom";
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

const PreviewQuery = ({
  match: {
    params: { revisionId },
    url,
  },
  children,
  history,
}) => {
  const { loading, error, data } = useQuery(PREVIEW_QUERY, {
    variables: { postId: revisionId },
  });

  if (loading) return <Loading />;
  if (error) return <LoadingError error={error.message} />;

  const obj = Object.assign({}, data.page || data.post);

  if (obj.isRestricted) {
    Config.removeAuthToken();
    Config.setRedirect(url);
    history.push("/login");
  }

  if (obj) {
    return children(obj);
  }

  return <NotFound />;
};

const QueryWithRouter = withRouter(PreviewQuery);

export default (WrappedComponent) => {
  return class extends Component {
    checkForAuthentication() {
      const {
        history,
        match: { url },
      } = this.props;

      if (!Config.getAuthToken()) {
        Config.setRedirect(url);
        history.push("/login");
      }
    }

    componentDidMount() {
      this.checkForAuthentication.bind(this)();
    }

    render() {
      return <WrappedComponent query={QueryWithRouter} {...this.props} />;
    }
  };
};

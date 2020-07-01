import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";

import Config from "../../config";
import Loading from "../elements/Loading";
import LoadingError from "../elements/LoadingError";
import NotFound from "../elements/NotFound";
import Heartbeat from "../elements/Heartbeat";

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
    localStorage.setItem("redirect", url);
    history.push("/login");
  }

  if (obj) {
    return children(obj);
  }

  return <NotFound />;
};

const QueryWithRouter = withRouter(PreviewQuery);

export default (WrappedComponent) => {
  return withRouter(
    class extends Component {
      checkForAuthentication() {
        const {
          history,
          match: { url },
        } = this.props;

        if (!Config.getAuthToken()) {
          localStorage.setItem("redirect", url);
          history.push("/login");
        }
      }

      componentDidMount() {
        this.checkForAuthentication.bind(this)();
      }

      render() {
        const { history } = this.props;

        return (
          <WrappedComponent query={QueryWithRouter} {...this.props}>
            <Heartbeat
              onError={() => {
                Config.removeAuthToken();
                history.push("/login");
              }}
            />
          </WrappedComponent>
        );
      }
    }
  );
};

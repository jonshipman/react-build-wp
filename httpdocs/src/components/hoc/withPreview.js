import React, { Component } from 'react';
import { withRouter, Redirect } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';

import NotFound from '../elements/NotFound';
import Loading from '../elements/Loading';
import LoadingError from '../elements/LoadingError';

import Config from '../../config';

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

const PreviewQuery = ({ match, children }) => {
  const { params } = match;

  const { loading, error, data } = useQuery(PREVIEW_QUERY, { variables: { postId: params.revisionId } });

  if (loading) return <Loading />;
  if (error) return <LoadingError error={error.message} />;

  const obj = Object.assign({}, data.page || data.post);

  if (obj.isRestricted && !obj.content) {
    obj.content = '<p>You are unauthorized to view this post.</p>';
  }

  if (obj) {
    return children(obj);
  }

  return <NotFound />
}

export default WrappedComponent => {
  return class extends Component {
    state = {
      query: false,
      redirect: null,
    }

    checkForAuthentication() {
      const { match } = this.props;
      const { params } = match;

      if (params.revisionId) {
        if (Config.getAuthToken()) {
          this.setState({ query: true });
        } else {
          localStorage.setItem('redirect', match.url);
          this.setState({ redirect: '/login', query: false });
        }
      } else {
        this.setState({ query: false });
      }
    }

    componentDidMount() {
      this.checkForAuthentication();
    }

    render() {
      const { query, redirect } = this.state;

      if (redirect) return <Redirect to={redirect} />

      if (query) return <WrappedComponent query={PreviewQuery} { ...this.props } />

      return <WrappedComponent { ...this.props } />
    }
  };
}
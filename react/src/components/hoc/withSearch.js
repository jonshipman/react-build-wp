import React, { Component, useRef } from 'react';
import { Helmet } from "react-helmet";
import { gql, useQuery } from '@apollo/client';

import { FRONTEND_URL } from '../../config';
import { PrimaryClasses } from '../elements/Button';
import Loading from '../elements/Loading';
import LoadingError from '../elements/LoadingError';
import PageWidth from '../elements/PageWidth';
import Title from '../elements/Title';

const SEARCH_QUERY = gql`
  query SearchQuery(
    $filter: String!,
    $first: Int,
    $last: Int,
    $after: String,
    $before: String
  ) {
    posts(
      first: $first,
      last: $last,
      after: $after,
      before: $before,
      where: { search: $filter, status: PUBLISH, hasPassword: false }
    ) {
      edges {
        node {
          id
          postId
          title
          uri
          excerpt
          dateFormatted
        }
      }
    }
  }
`;

const SearchForm = ({ setFilter }) => {
  const inputRef = useRef();

  const executeSearch = () => {
    if (inputRef.current) {
      setFilter(inputRef.current.value);

      console.log(`Searched for ${inputRef.current.value}`);
    }
  }

  return (
    <div className="search">
      <input
        ref={inputRef}
        className="db w-100 pa3 mv3 br6 ba b--black"
        type="text"
        placeholder="Search by name and content"
        onChange={e => e.target.value?.length > 1 && executeSearch()}
        onKeyDown={e => 'Enter' === e.key && executeSearch()}
      />
      <button
        className={`bn ${PrimaryClasses}`}
        type="button"
        onClick={() => executeSearch()}
      >
        Submit
      </button>
    </div>
  );
}

export default WrappedComponent => {
  return class extends Component {
    state = {
      filter: '',
    };

    Query({ variables, children }) {
      const { filter } = this.state;

      if (!filter) {
        return children({});
      }

      const { loading, error, data } = useQuery(SEARCH_QUERY, { variables: { ...variables, filter } });

      if (loading) return <Loading />
      if (error) return <LoadingError error={error.message} />

      return children(data);
    }

    Seo() {
      return (
        <Helmet>
          <title>Search</title>
          <link rel="canonical" href={`${FRONTEND_URL}/search`} />
        </Helmet>
      );
    }

    render() {
      return (
        <div className="search">
          <Title>Search</Title>

          <PageWidth className="mb4">
            <SearchForm setFilter={filter => { this.setState({ filter }) }} />
          </PageWidth>

          <WrappedComponent className='' Seo={this.Seo} title={null} NewQuery={this.Query.bind(this)} { ...this.props } />
        </div>
      );
    }
  }
}

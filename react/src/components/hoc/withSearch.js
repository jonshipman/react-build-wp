import React, { useRef, useState, createContext, useContext } from "react";
import { Helmet } from "react-helmet";
import { gql, useQuery } from "@apollo/client";

import { FRONTEND_URL } from "../../config";
import Loading from "../elements/Loading";
import LoadingError from "../elements/LoadingError";
import PageWidth from "../elements/PageWidth";
import Title from "../elements/Title";
import Button from "../elements/Button";

const SearchContext = createContext({});

const SEARCH_QUERY = gql`
  query SearchQuery(
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
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
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
  };

  return (
    <div className="search flex-l items-center-l">
      <input
        ref={inputRef}
        className="db w-100 pa3 mv3 br6 ba b--moon-gray"
        type="search"
        placeholder="Search by name and content"
        onChange={(e) => e.target.value?.length > 1 && executeSearch()}
        onKeyDown={(e) => "Enter" === e.key && executeSearch()}
      />
      <Button
        form={true}
        className="ml3 db pv3-l"
        onClick={() => executeSearch()}
      >
        Submit
      </Button>
    </div>
  );
};

const Query = ({ variables, children }) => {
  const { filter } = useContext(SearchContext);

  const { loading, error, data } = useQuery(SEARCH_QUERY, {
    variables: { ...variables, filter },
  });

  if (loading)
    return (
      <PageWidth className="mv4">
        <Loading />
      </PageWidth>
    );
  if (error)
    return (
      <PageWidth className="mv4">
        <LoadingError error={error.message} />
      </PageWidth>
    );

  return children(data);
};

export default (WrappedComponent) => {
  return (props) => {
    const [filter, setFilter] = useState("");

    return (
      <SearchContext.Provider value={{ filter }}>
        <Title>Search</Title>

        <Helmet>
          <title>Search</title>
          <link rel="canonical" href={`${FRONTEND_URL}/search`} />
        </Helmet>

        <WrappedComponent className="search" Query={Query} {...props}>
          <PageWidth className="mb4">
            <SearchForm setFilter={setFilter} />
          </PageWidth>
        </WrappedComponent>
      </SearchContext.Provider>
    );
  };
};

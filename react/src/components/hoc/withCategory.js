import React, { Component } from "react";
import { Helmet } from "react-helmet";
import { gql, useQuery } from "@apollo/client";

import { FRONTEND_URL } from "../../config";
import Loading from "../elements/Loading";
import LoadingError from "../elements/LoadingError";
import Title from "../elements/Title";

const CATEGORY_QUERY = gql`
  query CategoryQuery(
    $filter: String!
    $id: ID!
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
      where: { categoryName: $filter, status: PUBLISH, hasPassword: false }
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
          databaseId
          title
          uri
          excerpt
          dateFormatted
        }
      }
    }
    category(id: $id, idType: SLUG) {
      id
      databaseId
      name
      slug
      uri
      seo {
        metaDesc
        title
      }
    }
  }
`;

export default (WrappedComponent) => {
  return class extends Component {
    Query({ variables, children }) {
      const {
        history: {
          location: { pathname },
        },
      } = this.props;
      const p = [...pathname.split("/")].pop();
      const { loading, error, data } = useQuery(CATEGORY_QUERY, {
        variables: { ...variables, filter: p, id: p },
      });

      const { category } = data || {};

      if (loading) return <Loading />;
      if (error) return <LoadingError error={error.message} />;

      return (
        <>
          <Title>{category?.name}</Title>

          <Helmet>
            <title>{category?.seo?.title}</title>
            {category?.seo?.metaDesc && (
              <meta name="description" content={category?.seo?.metaDesc} />
            )}
            {category?.uri && (
              <link rel="canonical" href={`${FRONTEND_URL}${category?.uri}`} />
            )}
          </Helmet>

          {children(data)}
        </>
      );
    }

    render() {
      return (
        <WrappedComponent
          className="categories"
          title={null}
          Seo={null}
          NewQuery={this.Query.bind(this)}
          {...this.props}
        />
      );
    }
  };
};

import React from "react";
import { Helmet } from "react-helmet";
import { gql, useQuery } from "@apollo/client";

import { FRONTEND_URL } from "../../config";
import Loading from "../elements/Loading";
import LoadingError from "../elements/LoadingError";
import PageWidth from "../elements/PageWidth";
import Title from "../elements/Title";
import { useLocation } from "react-router-dom";

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
  const Query = ({ variables, children }) => {
    const { pathname } = useLocation();
    const p = [...pathname.replace(/\/+$/, "").split("/")].pop();

    const { loading, error, data } = useQuery(CATEGORY_QUERY, {
      variables: { ...variables, filter: p, id: p },
    });

    const { category } = data || {};

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
  };

  return (props) => {
    return (
      <WrappedComponent
        className="categories"
        title={null}
        Seo={null}
        Query={Query}
        {...props}
      />
    );
  };
};

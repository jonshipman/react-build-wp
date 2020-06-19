import React, { Component } from 'react';
import { Helmet } from "react-helmet";
import { gql, useQuery } from '@apollo/client';

import { FRONTEND_URL } from '../../config';
import Loading from '../elements/Loading';
import LoadingError from '../elements/LoadingError';
import Title from '../elements/Title';

const CATEGORY_QUERY = gql`
  query CategoryQuery(
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
          categories(first: 5) {
            edges {
              node {
                id
                databaseId
                slug
                name
              }
            }
          }
        }
      }
    }
    categories(where: { slug: [$filter] }) {
      edges {
        node {
          id
          databaseId
          name
          slug
          seo {
            metaDesc
            title
          }
        }
      }
    }
  }
`;

export default WrappedComponent => {
  return class extends Component {
    Query({ variables, children }) {
      const { match: { params: { category: filter } } } = this.props;
      const { loading, error, data } = useQuery(CATEGORY_QUERY, { variables: { ...variables, filter } });

      const category = data?.categories?.edges?.length > 0 ? data.categories.edges[0].node : null;

      if (loading) return <Loading />
      if (error) return <LoadingError error={error.message} />

      return (
        <>
          <Title>{category?.name}</Title>

          <Helmet>
            <title>{category?.seo?.title}</title>
            {category?.seo?.metaDesc && <meta name="description" content={category?.seo?.metaDesc}/>}
            {category?.slug && <link rel="canonical" href={`${FRONTEND_URL}/category/${category?.slug}`} />}
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
          { ...this.props }
        />
      );
    }
  }
}

import { CreatePaginationQuery } from "react-wp-gql";

export const LiteralSeo = `
  title
  metaDesc
  breadcrumbs {
    url
    text
  }
`;

export const FragmentPost = `
  fragment PostFragment on Post {
    id
    databaseId
    uri
    title
    excerpt
    content
    date
    seo {
      ${LiteralSeo}
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
`;

export const FragmentPage = `
  fragment PageFragment on Page {
    id
    databaseId
    uri
    title
    content
    seo {
      ${LiteralSeo}
    }
  }
`;

export const FragmentCategory = `
  fragment CategoryFragment on Category {
    id
    databaseId
    slug
    name
    uri
    seo {
      ${LiteralSeo}
    }
    ${CreatePaginationQuery("posts", "...PostFragment")}
  }
`;

export const FragmentTag = `
  fragment TagFragment on Tag {
    id
    databaseId
    slug
    name
    uri
    seo {
      ${LiteralSeo}
    }
    ${CreatePaginationQuery("posts", "...PostFragment")}
  }
`;

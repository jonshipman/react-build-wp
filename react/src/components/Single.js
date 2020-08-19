import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet";
import { gql, useQuery } from "@apollo/client";

import { FRONTEND_URL } from "../config";
import { ReactComponent as ClockIcon } from "../static/images/clock.svg";
import { ReactComponent as FolderIcon } from "../static/images/folder.svg";
import LoadingError from "./elements/LoadingError";
import NotFound from "./elements/NotFound";
import PageSkeleton from "./elements/PageSkeleton";
import PageWidth from "./elements/PageWidth";
import PostContent from "./elements/PostContent";
import Title from "./elements/Title";
import withContact from "./hoc/withContact";

/**
 * GraphQL page query that takes a page slug as a uri
 * Returns the title and content of the page
 */
const SINGLE_QUERY = gql`
  query SingleQuery($uri: ID!) {
    contentNode(id: $uri, idType: URI) {
      id
      databaseId
      slug
      __typename
      ... on Post {
        id
        dateFormatted
        title
        content
        seo {
          title
          metaDesc
          breadcrumbs {
            url
            text
          }
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
      ... on Page {
        id
        title
        content
        seo {
          title
          metaDesc
          breadcrumbs {
            url
            text
          }
        }
        pageTemplate
      }
    }
  }
`;

const DefaultQuery = ({ children }) => {
  const { pathname: uri } = useLocation();

  const { loading, error, data } = useQuery(SINGLE_QUERY, {
    variables: { uri },
  });

  if (loading) return <PageSkeleton />;
  if (error) return <LoadingError error={error.message} />;

  if (data?.contentNode) {
    return children(data.contentNode);
  }

  return <NotFound />;
};

function SingleRender({
  obj,
  renderChildrenAfter = false,
  renderTitle = true,
  children,
}) {
  return (
    <article className={`single post-${obj.databaseId}`}>
      <Seo
        title={obj.seo?.title}
        description={obj.seo?.title}
        canonical={obj.uri}
        breadcrumbs={obj.seo?.breadcrumbs}
      />

      {renderTitle &&
        ("Page" !== obj.__typename ? (
          <Title notHeading={true}>
            {obj?.categories?.edges?.length > 0
              ? obj.categories.edges[0].node.name
              : "Blog"}
          </Title>
        ) : (
          <Title>{obj?.title}</Title>
        ))}

      {!renderChildrenAfter && children}

      <PageWidth className="mv4">
        {"Page" !== obj.__typename && (
          <>
            <h1 className="f2 fw4 mb4">{obj.title}</h1>

            <div className="post-meta mv4">
              <div className="posted dib mr4">
                <ClockIcon className="mr2 v-mid" width={20} height={20} />
                <span>{obj.dateFormatted}</span>
              </div>

              {obj?.categories?.edges?.length > 0 && (
                <div className="post-categories dib">
                  <FolderIcon className="mr2 v-mid" width={20} height={20} />
                  <ul className="list pl0 dib">
                    {obj.categories.edges.map((category) => (
                      <li
                        key={`cat-${category.node.databaseId}-post-cats`}
                        className="dib mr2 pr2 br b--near-white drop-last-br"
                      >
                        <Link to={category.node.uri}>{category.node.name}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </>
        )}

        <PostContent content={obj.content} />
      </PageWidth>

      {renderChildrenAfter && children}
    </article>
  );
}

export default function Single({ Query = DefaultQuery }) {
  let LoadedSingle = SingleRender;

  const { pathname } = useLocation();
  if (pathname?.includes("contact")) {
    LoadedSingle = withContact(SingleRender);
  }

  return <Query>{(obj) => <LoadedSingle obj={obj} />}</Query>;
}

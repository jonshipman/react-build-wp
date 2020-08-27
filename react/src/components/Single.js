import React from "react";
import { Link } from "react-router-dom";

import { ReactComponent as ClockIcon } from "../static/images/clock.svg";
import { ReactComponent as FolderIcon } from "../static/images/folder.svg";
import Loading from "./elements/Loading";
import LoadingError from "./elements/LoadingError";
import NotFound from "./elements/NotFound";
import PageWidth from "./elements/PageWidth";
import PostContent from "./elements/PostContent";
import Seo from "./elements/Seo";
import Title from "./elements/Title";
import useSingle from "./hooks/useSingle";

export const TitleRender = ({
  title,
  __typename,
  categories = { edges: [] },
}) => {
  if ("Post" === __typename) {
    return (
      <Title heading="div">{categories.edges[0]?.node?.name || "Blog"}</Title>
    );
  } else {
    return <Title>{title}</Title>;
  }
};

export const ErrorRouting = ({ loading, error }) => {
  if (loading)
    return (
      <PageWidth>
        <Loading />
      </PageWidth>
    );
  if (error)
    return (
      <PageWidth>
        <LoadingError error={error.message} />
      </PageWidth>
    );

  return <NotFound />;
};

export const SingleRender = ({ node = {} }) => {
  const {
    seo = {},
    uri,
    databaseId,
    __typename,
    title,
    dateFormatted,
    categories = { edges: [] },
    content,
  } = node;
  return (
    <article className={`single post-${databaseId}`}>
      <Seo
        title={seo.title}
        description={seo.title}
        canonical={uri}
        breadcrumbs={seo.breadcrumbs}
      />
      <PageWidth className="mv4">
        {"Post" === __typename && (
          <>
            <h1 className="f2 fw4 mb4">{title}</h1>

            <div className="post-meta mv4">
              <div className="posted dib mr4">
                <ClockIcon className="mr2 v-mid" width={20} height={20} />
                <span>{dateFormatted}</span>
              </div>

              {categories.edges.length > 0 && (
                <div className="post-categories dib">
                  <FolderIcon className="mr2 v-mid" width={20} height={20} />
                  <ul className="list pl0 dib">
                    {categories.edges.map((category) => (
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

        <PostContent>{content}</PostContent>
      </PageWidth>
    </article>
  );
};

const Single = () => {
  const { node, loading, error } = useSingle();

  if (loading || error || !node.id) {
    return <ErrorRouting loading={loading} error={error} />;
  }

  return (
    <>
      <TitleRender {...node} />
      <SingleRender node={node} />
    </>
  );
};

export default Single;

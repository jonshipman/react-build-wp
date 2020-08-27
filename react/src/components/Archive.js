import React from "react";
import { Link } from "react-router-dom";

import { ErrorRouting } from "./Single";
import { ReactComponent as ClockIcon } from "../static/images/clock.svg";
import Button from "./elements/Button";
import PageWidth from "./elements/PageWidth";
import PostContent from "./elements/PostContent";
import Seo from "./elements/Seo";
import Title from "./elements/Title";
import useArchive from "./hooks/useArchive";

export const ArchiveRender = ({
  edges = [],
  hasPreviousPage,
  hasNextPage,
  goNext,
  goPrev,
}) => {
  if (!edges.length) {
    return <PageWidth>Nothing found.</PageWidth>;
  }

  return (
    <PageWidth className="entries">
      <div className="entries mb3">
        {edges.map((edge) => (
          <article
            key={edge.node.id}
            className={`content blog-entry post-${edge.node.databaseId}`}
          >
            <h2 className="mt0">
              <Link to={edge.node.uri}>{edge.node.title}</Link>
              <div className="posted fr-ns mt2 mt0-ns f6">
                <ClockIcon className="v-mid mr2" width={12} height={12} />
                <span>{edge.node.dateFormatted}</span>
              </div>
            </h2>

            <PostContent className="mv4">
              {edge.node.excerpt || edge.node?.content}
            </PostContent>

            <div className="tr">
              <Button to={edge.node.uri} type={3}>
                Read more
              </Button>
            </div>
          </article>
        ))}
      </div>

      <div className="pagination cf">
        {hasPreviousPage && (
          <Button className="fl" onClick={goPrev}>
            Previous
          </Button>
        )}

        {hasNextPage && (
          <Button className="fr" onClick={goNext}>
            Next
          </Button>
        )}
      </div>
    </PageWidth>
  );
};

const Archive = () => {
  const { edges, loading, error, ...props } = useArchive();

  if (loading || error || !edges.length) {
    return <ErrorRouting loading={loading} error={error} />;
  }

  return (
    <>
      <Seo title="Blog" canonical="/blog">
        <meta name="robots" content="noindex" />
      </Seo>

      <Title>Blog</Title>
      <ArchiveRender edges={edges} {...props} />
    </>
  );
};

export default Archive;

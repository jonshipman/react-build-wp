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

const PostCard = ({
  databaseId,
  uri,
  title,
  dateFormatted,
  excerpt,
  content,
}) => (
  <article
    className={`content blog-entry b--near-white bb pb4 mb4 post-${databaseId}`}
  >
    <h2 className="mt0">
      <Link to={uri}>{title}</Link>
      <div className="posted fr-ns mt2 mt0-ns f6">
        <ClockIcon className="v-mid mr2" width={12} height={12} />
        <span>{dateFormatted}</span>
      </div>
    </h2>

    <PostContent className="mv4" trim={true}>
      {excerpt || content}
    </PostContent>

    <div className="tr">
      <Button to={uri} type={3}>
        Read more
      </Button>
    </div>
  </article>
);

export const ArchiveRender = ({
  edges = [],
  card: Card = PostCard,
  hasPreviousPage,
  hasNextPage,
  next,
  prev,
}) => {
  if (!edges.length) {
    return <PageWidth>Nothing found.</PageWidth>;
  }

  return (
    <PageWidth className="entries">
      <Seo>
        <meta name="robots" content="noindex" />
      </Seo>

      <div className="entries">
        {edges.map((edge) => (
          <Card key={edge.node.id} {...edge.node} />
        ))}
      </div>

      <div className="pagination cf">
        {hasPreviousPage && (
          <Button className="fl" onClick={prev}>
            Previous
          </Button>
        )}

        {hasNextPage && (
          <Button className="fr" onClick={next}>
            Next
          </Button>
        )}
      </div>
    </PageWidth>
  );
};

export const ArchiveLayout = ({ edges, loading, error, ...props }) => {
  if (loading || error || !edges.length) {
    return <ErrorRouting loading={loading} error={error} />;
  }

  return <ArchiveRender edges={edges} {...props} />;
};

const Archive = () => {
  const { edges, loading, error, ...props } = useArchive();
  const layoutProps = {
    edges,
    loading,
    error,
    ...props,
  };

  return (
    <>
      <Seo title="Blog" canonical="/blog" />

      <Title>Blog</Title>
      <ArchiveLayout {...layoutProps} />
    </>
  );
};

export default Archive;

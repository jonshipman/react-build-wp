import React from "react";
import { useLocation, useParams, Redirect } from "react-router-dom";

import { SingleRender, TitleRender, ErrorRouting } from "./Single";
import Config from "../config";
import useSingle from "./hooks/useSingle";
import withHeartbeat from "./hoc/withHeartbeat";

const Preview = () => {
  const { revisionId } = useParams();
  const { pathname } = useLocation();

  const { node, loading, error } = useSingle({
    ssr: false,
    databaseId: revisionId,
  });

  if (loading || error || !node.id) {
    return <ErrorRouting loading={loading} error={error} />;
  }

  if (node.isRestricted) {
    Config.removeAuthToken();
    Config.setRedirect(pathname);
    return <Redirect to="/login" />;
  }

  return (
    <>
      <TitleRender {...node} />
      <SingleRender {...node} />
    </>
  );
};

export default withHeartbeat(Preview);

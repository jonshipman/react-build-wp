import React from "react";
import { LeadForm } from "react-boilerplate-leadform";

import { SingleRender, TitleRender, ErrorRouting } from "./Single";
import useSingle from "./hooks/useSingle";

const Contact = () => {
  const { node, loading, error } = useSingle();

  if (loading || error || !node.id) {
    return <ErrorRouting loading={loading} error={error} />;
  }

  return (
    <>
      <TitleRender {...node} />
      <SingleRender node={node} />
      <div className="bg-silver pv5">
        <LeadForm className="mw6 center" />
      </div>
    </>
  );
};

export default Contact;

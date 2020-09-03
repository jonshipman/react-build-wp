import React from "react";
import { LeadForm } from "react-boilerplate-leadform";
import {
  NodeProvider,
  SingleRender,
  SingleTitle,
  ErrorRouting,
  useSingle,
  Populate,
} from "react-boilerplate-nodes";

import { ButtonClasses } from "./elements/Button";

const Contact = (props) => {
  Populate(props);
  const { node, loading, error } = useSingle();

  return (
    <NodeProvider value={props}>
      {loading || error || !node.id ? (
        <ErrorRouting loading={loading} error={error} />
      ) : (
        <React.Fragment>
          <SingleTitle {...node} />
          <SingleRender node={node} />
          <div className="pv5">
            <LeadForm
              className="mw6 center"
              classes={{ button: ButtonClasses.buttonType1 }}
            />
          </div>
        </React.Fragment>
      )}
    </NodeProvider>
  );
};

export default Contact;

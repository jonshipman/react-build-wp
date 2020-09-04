import React from "react";
import { LeadForm } from "react-boilerplate-leadform";
import {
  SingleRender,
  SingleTitle,
  ErrorRouting,
  useSingle,
} from "react-boilerplate-nodes";

import { ButtonClasses } from "./elements/Button";

const Contact = () => {
  const { node, loading, error } = useSingle();

  return (
    <>
      <SingleTitle {...node} />
      {loading || error || !node.id ? (
        <ErrorRouting loading={loading} error={error} />
      ) : (
        <>
          <SingleRender node={node} />
          <div className="pv5">
            <LeadForm
              className="mw6 center"
              classes={{
                button: ButtonClasses.buttonType1,
              }}
            />
          </div>
        </>
      )}
    </>
  );
};

export default Contact;

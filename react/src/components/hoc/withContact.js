import React from "react";

import LeadForm from "../elements/LeadForm";

export default (WrappedComponent) => {
  return (props) => {
    return (
      <WrappedComponent renderChildrenAfter={true} {...props}>
        <div className="bg-silver pv5">
          <LeadForm />
        </div>
      </WrappedComponent>
    );
  };
};

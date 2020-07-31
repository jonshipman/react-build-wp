import React from "react";

import LeadForm from "../elements/LeadForm";

export default (WrappedComponent) => {
  return (props) => (
    <WrappedComponent renderChildrenAfter={true} {...props}>
      <div className="bg-silver pv5">
        <LeadForm />
      </div>
    </WrappedComponent>
  );
};

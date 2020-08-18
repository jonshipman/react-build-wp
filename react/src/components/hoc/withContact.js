import React from "react";

import LeadForm from "../elements/LeadForm";

export default function withContactHoc(WrappedComponent) {
  return function withContact(props) {
    return (
      <WrappedComponent renderChildrenAfter={true} {...props}>
        <div className="bg-silver pv5">
          <LeadForm />
        </div>
      </WrappedComponent>
    );
  };
}

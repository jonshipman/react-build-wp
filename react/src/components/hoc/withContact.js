import React, { Component } from 'react';

import LeadForm from '../elements/LeadForm';

export default WrappedComponent => {
  return class extends Component {
    render() {
      return (
        <WrappedComponent childrenAfterContent={true} { ...this.props }>
          <div className="bg-silver pv5">
            <LeadForm />
          </div>
        </WrappedComponent>
      );
    }
  }
}
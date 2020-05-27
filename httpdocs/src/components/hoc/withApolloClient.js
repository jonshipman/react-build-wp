import React, { Component } from 'react';
import { ApolloConsumer } from '@apollo/client';

export default WrappedComponent => {
  return class extends Component {
    render() {
      return (
        <ApolloConsumer>
          {client => {
            return <WrappedComponent client={client} { ...this.props } />
          }}
        </ApolloConsumer>
      );
    }
  }
};
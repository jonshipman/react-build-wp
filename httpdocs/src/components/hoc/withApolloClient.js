import React, { Component } from 'react';
import { ApolloConsumer } from '@apollo/client';

export default WrappedComponent => {
  return class extends Component {
    _mounted = false;

    componentDidMount() {
      this._mounted = true;
    }

    componentWillUnmount() {
      this._mounted = false;
    }

    render() {
      return (
        <ApolloConsumer>
          {client => {
            return this._mounted ? <WrappedComponent client={client} { ...this.props } /> : null;
          }}
        </ApolloConsumer>
      );
    }
  }
};
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

    isMounted() {
      return this._mounted;
    }

    render() {
      return (
        <ApolloConsumer>
          {client => {
            return <WrappedComponent isMounted={this.isMounted.bind(this)} client={client} { ...this.props } />
          }}
        </ApolloConsumer>
      );
    }
  }
};
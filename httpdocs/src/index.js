import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { ApolloProvider, ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

import App from './components/App';
import ScrollToTop from './components/utils/ScrollToTop';

import './styles/style.scss';
import Config from './config';

// Apollo GraphQL client
const client = new ApolloClient({
  link: new HttpLink({
    uri: Config.gqlUrl,
  }),
  cache: new InMemoryCache().restore(window.__APOLLO_STATE__ || null),
});

let renderMethod;

if ('client' === process.env.REACT_APP_RENDER) {
  renderMethod = ReactDOM.render;
} else {
  renderMethod = ReactDOM.hydrate;
}

renderMethod(
  <BrowserRouter>
    <ScrollToTop />
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </BrowserRouter>,
  document.getElementById('root'),
);

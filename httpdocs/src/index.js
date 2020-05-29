import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { ApolloProvider, ApolloClient, InMemoryCache, HttpLink, ApolloLink, from } from '@apollo/client';

import App from './components/App';
import ScrollToTop from './components/utils/ScrollToTop';

import Config from './config';
import { AUTH_TOKEN } from './constants';

import './styles/style.scss';

/**
 * Create the HttpLink for the ApolloClient.
 */
const link = new HttpLink({
  uri: Config.gqlUrl,
  credentials: 'same-origin',
});

/**
 * Authentication Middleware.
 * If there is an auth_token localStorage, pass it as an auth bearer for jwt.
 */
const authMiddleware = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem(AUTH_TOKEN);
  const authHeader = token ? `Bearer ${token}` : null;

  operation.setContext({
    headers: {
      Authorization: authHeader,
    }
  });

  return forward(operation);
});

/**
 * After we get the response, handle jwt actions.
 */
const authAfterware = new ApolloLink((operation, forward) => {
  return forward(operation).map(response => {
    const context = operation.getContext();
    const { response: { headers } } = context;

    // If we get an error, remove the invalid token.
    if (response.errors && response.errors.length) {
      if (localStorage.getItem(AUTH_TOKEN)) {
        localStorage.removeItem(AUTH_TOKEN);
      }
    }

    // Get the refresh token and update the localStorage.
    if (headers) {
      const refreshToken = headers.get('x-jwt-refresh');
      if (refreshToken) {
        localStorage.setItem(AUTH_TOKEN, refreshToken);
      }
    }

    return response;
  });
});

/**
 * Apollo GraphQL client.
 */
const client = new ApolloClient({
  link: from([
    authMiddleware,
    authAfterware,
    link
  ]),
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

import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { ApolloProvider, ApolloClient, InMemoryCache, HttpLink, ApolloLink, from } from '@apollo/client';

import App from './components/App';
import ScrollToTop from './components/utils/ScrollToTop';

import Config from './config';

import 'animate.css';
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
  const token = Config.getAuthToken();
  const authHeader = token ? `Bearer ${token}` : null;

  if (authHeader) {
    operation.setContext({
      headers: {
        Authorization: authHeader,
      }
    });
  }

  return forward(operation);
});

/**
 * After we get the response, handle jwt actions.
 */
const authAfterware = new ApolloLink((operation, forward) => {
  return forward(operation).map(response => {
    const context = operation.getContext();
    const { response: { headers } } = context;

    // If we get an error, log the error.
    if (response?.errors?.length > 0) {
      console.error(response.errors);
    }

    // Get the refresh token and update the localStorage.
    if (headers) {
      const refreshToken = headers.get('x-jwt-refresh');
      if (refreshToken) {
        Config.setAuthToken(refreshToken);
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

if (window.__REACT_HYDRATE__) {
  renderMethod = ReactDOM.hydrate;
} else {
  renderMethod = ReactDOM.render;
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

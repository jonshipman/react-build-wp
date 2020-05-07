import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider, ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { BrowserRouter } from 'react-router-dom';
import './styles/style.scss';
import Config from './config';
import App from './components/App';
import ScrollToTop from './components/elements/ScrollToTop';

// Apollo GraphQL client
const client = new ApolloClient({
  link: new HttpLink({
    uri: Config.gqlUrl,
  }),
  cache: new InMemoryCache().restore(window.__APOLLO_STATE__ || null),
});

ReactDOM.hydrate(
  <BrowserRouter>
    <ApolloProvider client={client}>
      <ScrollToTop>
        <App />
      </ScrollToTop>
    </ApolloProvider>
  </BrowserRouter>,
  document.getElementById('root'),
);

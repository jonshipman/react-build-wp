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

let renderMethod;

if ('client' === process.env.REACT_APP_RENDER) {
  renderMethod = ReactDOM.render;
} else {
  renderMethod = ReactDOM.hydrate;
}

renderMethod(
  <BrowserRouter>
    <ApolloProvider client={client}>
      <ScrollToTop>
        <App />
      </ScrollToTop>
    </ApolloProvider>
  </BrowserRouter>,
  document.getElementById('root'),
);

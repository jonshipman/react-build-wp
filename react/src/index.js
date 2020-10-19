import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { ApolloSetup, ApolloProvider } from "react-boilerplate-nodes";
import { gqlUrl } from "./config";
import { ScrollToTop } from "./components/ScrollToTop";
import { App } from "./App";
import * as serviceWorker from "./serviceWorker";

const client = ApolloSetup({ gqlUrl });

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
  document.getElementById("root")
);

// Enable when live.
serviceWorker.unregister();

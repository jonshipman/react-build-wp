import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { ApolloSetup, ApolloProvider } from "react-boilerplate-nodes";
import { gqlUrl } from "./config";
import { ScrollToTop } from "./components";
import { App } from "./App";
import reportWebVitals from "./reportWebVitals";

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

reportWebVitals();

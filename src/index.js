import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { NodeProvider } from "react-wp-gql";
import { ScrollToTop } from "./components";
import ApolloProvider from "./Apollo";
import * as fragments from "./gql/fragments";
import reportWebVitals from "./reportWebVitals";

const nodeProps = {
  siteName: process.env.REACT_APP_TITLE,
  fragments,
  cache: true,
};

ReactDOM.render(
  <BrowserRouter>
    <ScrollToTop />
    <ApolloProvider>
      <NodeProvider {...nodeProps}>
        <App />
      </NodeProvider>
    </ApolloProvider>
  </BrowserRouter>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

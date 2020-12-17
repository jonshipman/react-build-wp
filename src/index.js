import React from "react";
import ReactDOM from "react-dom";
import { App } from "./App";
import { BrowserRouter } from "react-router-dom";
import { gqlUrl } from "./config";
import { NodeProvider } from "react-wp-gql";
import { ScrollToTop } from "./components";
import * as queries from "./gql/queries";
import reportWebVitals from "./reportWebVitals";

const nodeProps = {
  siteName: "React Build",
  queries,
  gqlUrl,
};

ReactDOM.render(
  <BrowserRouter>
    <ScrollToTop />
    <NodeProvider {...nodeProps}>
      <App />
    </NodeProvider>
  </BrowserRouter>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

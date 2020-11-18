// React
import React from "react";
import { Switch, Route } from "react-router-dom";
import { WordPressRoutes, NodeProvider } from "react-wp-gql";
import { FRONTEND_URL } from "./config";
import { Header, Footer, Main } from "./layout";
import { Home } from "./home";
import * as queries from "./gql/queries";
import "./app.scss";

const nodeProps = {
  FRONTEND_URL,
  queries,
};

export const App = () => (
  <NodeProvider {...nodeProps}>
    <Header />
    <Main>
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>

        <WordPressRoutes />
      </Switch>
    </Main>
    <Footer />
  </NodeProvider>
);

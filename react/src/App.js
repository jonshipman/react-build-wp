// React
import React from "react";
import { Switch, Route } from "react-router-dom";
import { WordPressRoutes, NodeProvider } from "react-boilerplate-nodes";
import { FormGroup } from "react-boilerplate-leadform";
import { FRONTEND_URL } from "./config";
import { Header } from "./layout/Header";
import { Footer } from "./layout/Footer";
import { Main } from "./layout/Main";
import { Home } from "./home/Home";
import * as queries from "./gql/queries";
import "./app.scss";

const nodeProps = {
  FRONTEND_URL,
  queries,
  components: {
    FormGroup,
  },
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

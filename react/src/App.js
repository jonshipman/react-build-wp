// React
import React from "react";
import { Switch, Route } from "react-router-dom";
import { WordPressRoutes } from "react-wp-gql";
import { Header, Footer, Main } from "./layout";
import { Home } from "./home";
import "./app.scss";

export const App = () => (
  <div className="min-vh-100 flex items-stretch flex-column w-100 sans-serif near-black">
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
  </div>
);

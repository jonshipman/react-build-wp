// React
import React from "react";
import { Switch, Route, useLocation } from "react-router-dom";
import { WordPressRoutes, Node } from "react-wp-gql";
import { Header, Footer, Main } from "./layout";
import { Home } from "./home";
import "./app.scss";

export const App = () => {
  const { search } = useLocation();
  const previewId = new URLSearchParams(search).get("p");

  return (
    <div className="min-vh-100 flex items-stretch flex-column w-100 sans-serif near-black">
      <Header />
      <Main>
        <Switch>
          <Route exact path="/">
            {previewId ? <Node databaseId={previewId} /> : <Home />}
          </Route>

          <WordPressRoutes />
        </Switch>
      </Main>
      <Footer />
    </div>
  );
};

// React
import React from "react";
import { Switch, Route } from "react-router-dom";

// Misc internal
import withPreview from "./hoc/withPreview";
import withHeartbeat from "./hoc/withHeartbeat";
import withSearch from "./hoc/withSearch";
import withCategory from "./hoc/withCategory";
import Cleanup from "./elements/Cleanup";

// External Scripts
// import { FacebookTracking, GoogleTracking } from './external-scripts/Tracking';

// Pages and Header/Footer
import Archive from "./Archive";
import Footer from "./Footer";
import Header from "./Header";
import Home from "./Home";
import Login from "./Login";
import Single from "./Single";

export default function App() {
  const protectedTypes = ["User"];
  const Search = withSearch(Archive);
  const Category = withCategory(Archive);
  const Preview = withHeartbeat(
    withPreview(Single),
    <Cleanup redirect="/login" types={protectedTypes} />
  );

  return (
    <>
      <Header />
      <div className="main lh-copy relative z-1">
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>

          <Route
            exact
            path={[
              "/login",
              "/register",
              "/forgot-password",
              "/rp/:key/:login",
            ]}
          >
            <Login />
          </Route>

          <Route exact path="/logout">
            <Cleanup redirect="/" types={protectedTypes} />
          </Route>

          <Route exact path="/search">
            <Search />
          </Route>
          <Route exact path="/blog">
            <Archive />
          </Route>
          <Route path="/category/">
            <Category />
          </Route>

          <Route path="/_preview/:parentId/:revisionId/:type/:status/:nonce">
            <Preview />
          </Route>

          <Route path="*">
            <Single />
          </Route>
        </Switch>
      </div>
      <Footer />

      {/* Load the FacebookTracking and GoogleTracking components here */}
    </>
  );
}

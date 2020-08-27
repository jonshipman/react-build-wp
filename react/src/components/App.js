// React
import React from "react";
import { Switch, Route } from "react-router-dom";

// Misc internal
import { protectedTypes } from "./hoc/withHeartbeat";
import Cleanup from "./elements/Cleanup";
import withCategory from "./hoc/withCategory";

// External Scripts
// import { FacebookTracking, GoogleTracking } from './external-scripts/Tracking';

// Pages and Header/Footer
import Archive from "./Archive";
import Contact from "./Contact";
import Footer from "./Footer";
import Header from "./Header";
import Home from "./Home";
import Login from "./Login";
import Preview from "./Preview";
import Search from "./Search";
import Single from "./Single";

const App = () => {
  const Category = withCategory(Archive);

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

          <Route exact path="/contact">
            <Contact />
          </Route>
          <Route exact path="/contact-us">
            <Contact />
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
};

export default App;

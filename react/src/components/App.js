// React
import React from "react";
import { Switch, Route } from "react-router-dom";
import {
  Archive,
  Category,
  Preview,
  Search,
  Single,
} from "react-boilerplate-nodes";
import { FormGroup, Button } from "react-boilerplate-leadform";

// Misc internal
import { FRONTEND_URL } from "../config";
import { protectedTypes } from "./hoc/withHeartbeat";
import Cleanup from "./elements/Cleanup";

// External Scripts
// import { FacebookTracking, GoogleTracking } from './external-scripts/Tracking';

// Pages and Header/Footer
import Contact from "./Contact";
import Footer from "./Footer";
import Header from "./Header";
import Home from "./Home";
import Login from "./Login";

const nodeProps = {
  FRONTEND_URL,
  components: {
    FormGroup,
    Button,
  },
};

const App = () => (
  <>
    <Header />
    <div className="main lh-copy relative z-1">
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>

        <Route
          exact
          path={["/login", "/register", "/forgot-password", "/rp/:key/:login"]}
        >
          <Login />
        </Route>

        <Route exact path="/logout">
          <Cleanup redirect="/" types={protectedTypes} />
        </Route>

        <Route exact path="/search">
          <Search {...nodeProps} />
        </Route>
        <Route exact path="/blog">
          <Archive {...nodeProps} />
        </Route>
        <Route path="/category/">
          <Category {...nodeProps} />
        </Route>

        <Route path="/_preview/:parentId/:revisionId/:type/:status/:nonce">
          <Preview {...nodeProps} />
        </Route>

        <Route exact path="/contact">
          <Contact {...nodeProps} />
        </Route>
        <Route exact path="/contact-us">
          <Contact {...nodeProps} />
        </Route>

        <Route path="*">
          <Single {...nodeProps} />
        </Route>
      </Switch>
    </div>
    <Footer />

    {/* Load the FacebookTracking and GoogleTracking components here */}
  </>
);

export default App;

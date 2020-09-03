// React
import React from "react";
import { Switch, Route } from "react-router-dom";
import {
  Archive,
  Category,
  NodeProvider,
  Preview,
  Search,
  Single,
  Login,
  useCleanup,
} from "react-boilerplate-nodes";
import { FormGroup } from "react-boilerplate-leadform";
import Button from "./elements/Button";

// Misc internal
import { FRONTEND_URL } from "../config";

// External Scripts
// import { FacebookTracking, GoogleTracking } from './external-scripts/Tracking';

// Pages and Header/Footer
import Contact from "./Contact";
import Footer from "./Footer";
import Header from "./Header";
import Home from "./Home";

const nodeProps = {
  FRONTEND_URL,
  components: {
    FormGroup,
    Button,
  },
};

const Logout = () => {
  useCleanup({ redirect: "/" });
};

const App = () => (
  <NodeProvider {...nodeProps}>
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
          <Logout />
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
  </NodeProvider>
);

export default App;

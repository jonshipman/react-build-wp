// React
import React from "react";
import { Switch, Route } from "react-router-dom";
import { WordPressRoutes, NodeProvider } from "react-boilerplate-nodes";
import { FormGroup } from "react-boilerplate-leadform";
import Button from "./elements/Button";

// Misc internal
import { FRONTEND_URL } from "../config";

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

const App = () => (
  <NodeProvider {...nodeProps}>
    <Header />
    <div className="main lh-copy relative z-1">
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>

        <Route exact path="/contact">
          <Contact />
        </Route>
        <Route exact path="/contact-us">
          <Contact />
        </Route>

        <WordPressRoutes />
      </Switch>
    </div>
    <Footer />
  </NodeProvider>
);

export default App;

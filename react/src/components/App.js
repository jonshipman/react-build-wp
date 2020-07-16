// React
import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";

// Misc internal
import { isWebpSupported } from "./utils/Browser";
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

export default class extends Component {
  componentDidMount() {
    if (isWebpSupported()) {
      document.getElementById("root").classList.add("webp");
    }

    // Prevents the jpg from loading before the webp class is added.
    // Image background is added on loaded class.
    document.getElementById("root").classList.add("loaded");
  }

  render() {
    const protectedTypes = ["User"];

    return (
      <>
        <Header />
        <div className="main lh-copy relative z-1">
          <Switch>
            <Route exact path="/" component={Home} />
            <Route
              exact
              path={[
                "/login",
                "/register",
                "/forgot-password",
                "/rp/:key/:login",
              ]}
              component={Login}
            />
            <Route
              exact
              path="/logout"
              render={() => {
                return <Cleanup redirect="/" types={protectedTypes} />;
              }}
            />

            <Route exact path="/search" component={withSearch(Archive)} />
            <Route exact path="/blog" component={Archive} />
            <Route path="/category/" component={withCategory(Archive)} />

            <Route
              path="/_preview/:parentId/:revisionId/:type/:status/:nonce"
              component={withHeartbeat(
                withPreview(Single),
                <Cleanup redirect="/login" types={protectedTypes} />
              )}
            />
            <Route path="*" component={Single} />
          </Switch>
        </div>
        <Footer />

        {/* Load the FacebookTracking and GoogleTracking components here */}
      </>
    );
  }
}

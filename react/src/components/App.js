// React
import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

// Misc internal
import { isWebpSupported } from './utils/Browser';
import withPreview from './hoc/withPreview';
import withHeartbeat from './hoc/withHeartbeat';
import withSearch from './hoc/withSearch';
import withCategory from './hoc/withCategory';
import Config from '../config';

// External Scripts
// import { FacebookTracking, GoogleTracking } from './external-scripts/Tracking';

// Pages and Header/Footer
import Archive from './Archive';
import Footer from './Footer';
import Header from './Header';
import Home from './Home';
import Login from './Login';
import Single from './Single';

export default class extends Component {
  componentDidMount() {
    if (isWebpSupported()) {
      document.getElementById('root').classList.add('webp');
    }

    // Prevents the jpg from loading before the webp class is added.
    // Image background is added on loaded class.
    document.getElementById('root').classList.add('loaded');
  }

  HeartbeatError({ history }) {
    Config.removeAuthToken();
    history.push("/login");
  }

  render() {
    return (
      <>
        <Header />
        <div className="main lh-copy relative z-1">
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/logout" render={() => {
               Config.removeAuthToken();

               return <Redirect to="/" />
            }} />

            <Route exact path="/search" component={withSearch(Archive)} />
            <Route exact path="/blog" component={Archive} />
            <Route exact path="/category/:category" component={withCategory(Archive)} />

            <Route path="/_preview/:parentId/:revisionId/:type/:status/:nonce" component={withHeartbeat(withPreview(Single), this.HeartbeatError.bind(this))} />
            <Route path="*" component={Single} />
          </Switch>
        </div>
        <Footer />

        {/* Load the FacebookTracking and GoogleTracking components here */}
      </>
    );
  }
}

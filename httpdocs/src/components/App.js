// React
import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

// Misc internal
import { BACKEND_URL } from '../config';
import { isWebpSupported } from './utils/Browser';

import Header from './elements/Header';
import Footer from './elements/Footer';

import withPreview from './hoc/withPreview';

// External Scripts
// import GoogleTracking from './external-scripts/GoogleTracking';
// import FacebookTracking from './external-scripts/FacebookTracking';

// Pages
import Home from './Home';
import Login from './Login';
import Search from './Search';
import Single from './Single';
import Archive from './Archive';
import Contact from './Contact';

class App extends Component {
  componentDidMount() {
    if (isWebpSupported()) {
      document.getElementById('root').classList.add('webp');
    }

    // Prevents the jpg from loading before the webp class is added.
    // Image background is added on loaded class.
    document.getElementById('root').classList.add('loaded');
  }

  Admin = () => {
    global.window && (global.window.location.href = BACKEND_URL + '/wp-admin');

    return null;
  }

  render() {
    return (
      <>
        <Header />
        <div className="main lh-copy relative z-1">
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/search" component={Search} />

            <Route exact path="/blog" render={props => <Archive { ...props } allPosts={true} />} />
            <Route exact path="/blog/:category" component={Archive} />

            <Route exact path="/contact" component={Contact} />
            <Route exact path="/contact-us" component={Contact} />

            <Route exact path="/wp-admin" render={this.Admin} />
            <Route exact path="/wp-login.php" render={this.Admin} />

            <Route path="/_preview/:parentId/:revisionId/:type/:status/:nonce" component={withPreview(Single)} />
            <Route path="*" component={Single} />
          </Switch>
        </div>
        <Footer />

        {/* Load the FacebookTracking and GoogleTracking components here */}
      </>
    );
  }
}

export default App;
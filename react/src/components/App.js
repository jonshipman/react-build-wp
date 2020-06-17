// React
import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

// Misc internal
import { isWebpSupported } from './utils/Browser';
import withPreview from './hoc/withPreview';

// External Scripts
// import { FacebookTracking, GoogleTracking } from './external-scripts/Tracking';

// Pages and Header/Footer
import Header from './Header';
import Footer from './Footer';
import Home from './Home';
import Login from './Login';
import Search from './Search';
import Single from './Single';
import Archive from './Archive';
import Contact from './Contact';

export default class extends Component {
  componentDidMount() {
    if (isWebpSupported()) {
      document.getElementById('root').classList.add('webp');
    }

    // Prevents the jpg from loading before the webp class is added.
    // Image background is added on loaded class.
    document.getElementById('root').classList.add('loaded');
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
            <Route exact path="/category/:category" component={Archive} />

            <Route exact path="/contact" component={Contact} />
            <Route exact path="/contact-us" component={Contact} />

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

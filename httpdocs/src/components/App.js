import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Header from './elements/Header';
import Footer from './elements/Footer';
import Home from './Home';
import Login from './Login';
import Search from './Search';
import Page from './Page';
import Post from './Post';
import Category from './Category';
import { BACKEND_URL } from '../constants';

export default () => (
  <>
    <Header />
    <div className="main">
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/search" component={Search} />
        <Route exact path="/blog/:slug" component={Post} />
        <Route exact path="/category/:slug" component={Category} />
        <Route exact path="/wp-admin" render={() => {
          global.window && (global.window.location.href = BACKEND_URL + '/wp-admin');

          return null;
        }} />

        <Route exact path="/:slug" component={Page} />
      </Switch>
    </div>
    <Footer />
  </>
);

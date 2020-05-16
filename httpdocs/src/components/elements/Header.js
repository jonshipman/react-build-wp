import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { Link } from 'react-router-dom';

import PageWidth from '../layout/PageWidth';

import NestedMenu from './NestedMenu';

import { ReactComponent as Logo } from '../../static/images/logo.svg';

const Header = ({ sticky }) => (
  <header id="header" className={`w-100 z-2 ${sticky ? 'fixed top-0' : 'relative'}`}>
    <div className="bg-white-80">
      <nav>
        <PageWidth className="dt">
          <div className="dtc v-mid brand">
            <Link to="/" className="dib grow-large border-box pv2">
              <Logo className="w4 nb1"/>
            </Link>
          </div>
          <div className="dtc v-mid tr">
            <NestedMenu location="header-menu" className="ma0" />
          </div>
        </PageWidth>
      </nav>
    </div>
  </header>
)

export default () => (
  <Switch>
    <Route path='/' exact render={props => <Header { ...props} sticky={true}/>} />
    <Route render={props => <Header { ...props} sticky={false}/>} />
  </Switch>
);

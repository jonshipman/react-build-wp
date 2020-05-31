import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { Link } from 'react-router-dom';

import PageWidth from '../layout/PageWidth';
import NestedMenu from './NestedMenu';

import { ReactComponent as Logo } from '../../static/images/logo.svg';

const openMenu = () => {
  let menu = document.getElementById('menu-header-menu').classList;
  if (menu.contains('dn')) {
    menu.remove('dn');
  } else {
    menu.add('dn');
  }
}

const Header = ({ sticky }) => (
  <header id="header" className={`w-100 z-2 ${sticky ? 'absolute fixed-l top-0' : 'relative'}`}>
    <div className="bg-white bg-white-80-l">
      <nav>
        <PageWidth className="dt-l">
          <div className="brand flex items-center tc dtc-l v-mid-l tl-l">
            <div className="mobile-toggle pr3 pv3 db dn-l" onClick={openMenu}>
              <div/><div/><div/>
            </div>
            <Link to="/" className="dib grow-large border-box mv3" onClick={() => {document.getElementById('menu-header-menu').classList.add('dn')}}>
              <Logo className="w4 nb1"/>
            </Link>
          </div>
          <div className="db tc dtc-l v-mid-l tr-l">
            <NestedMenu location="header-menu" className="dn ma0 pl0 list db-l" anchorOnclick={openMenu} />
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

import React, { useRef, useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';
import { Link } from 'react-router-dom';

import { ReactComponent as Logo } from '../static/images/logo.svg';
import Menu from './elements/Menu';
import PageWidth from './elements/PageWidth';

const openMenu = () => {
  let menu = document.getElementById('menu-header-menu').classList;
  if (menu.contains('dn')) {
    menu.remove('dn');
  } else {
    menu.add('dn');
  }
}

const Header = ({ sticky }) => {
  const headerRef = useRef();
  const spacerRef = useRef();

  useEffect(() => {
    if (sticky && spacerRef.current) {
      spacerRef.current.style.height = `${headerRef?.current?.clientHeight}px`;
    }
  }, [sticky]);

  return (
    <header id="header">
      <div ref={headerRef} className={`w-100 z-2 ${sticky ? 'absolute fixed-l top-0' : 'relative'}`}>
        <div className="bg-white">
          <nav>
            <PageWidth className="dt-l">
              <div className="brand flex items-center tc dtc-l v-mid-l tl-l">
                <div className="mobile-toggle pr3 pv3 db dn-l" onClick={openMenu}>
                  <div/><div/><div/>
                </div>
                <Link to="/" className="dib border-box mv3" onClick={() => document.getElementById('menu-header-menu').classList.add('dn')}>
                  <Logo className="w4 nb1"/>
                </Link>
              </div>
              <div className="db tc dtc-l v-mid-l tr-l">
                <Menu location="HEADER_MENU" className="dn ma0 pl0 list db-l" anchorOnclick={openMenu} />
              </div>
            </PageWidth>
          </nav>
        </div>
      </div>

      {sticky && (
        <div ref={spacerRef} />
      )}
    </header>
  );
}

export default () => (
  <Switch>
    <Route path='/' exact render={props => <Header { ...props} sticky={true}/>} />
    <Route render={props => <Header { ...props} sticky={false}/>} />
  </Switch>
);

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { ReactComponent as SearchIcon } from '../../static/images/search.svg';
import NestedMenu from './NestedMenu';
import Image from 'react-image-webp';

class Header extends Component {
  render() {
    return (
      <header id="header">
        <div id="inner-header">
          <div className="brand">
            <Link to="/">
                <Image
                  height={65}
                  src={require('../../static/images/logo-raster.png')}
                  webp={require('../../static/images/logo-raster.webp')}
                />
            </Link>
          </div>
          <div className="links dn flex-l justify-between items-center">
            <NestedMenu location="header-menu"/>

            <Link to="/search" className="search-icon">
              <SearchIcon width={25} height={25} />
            </Link>
          </div>
        </div>
      </header>
    );
  }
}

export default Header;

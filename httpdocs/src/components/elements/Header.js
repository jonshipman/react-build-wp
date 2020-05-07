import React from 'react';
import { Link } from 'react-router-dom';

import Image from './Image';
import NestedMenu from './NestedMenu';

import { ReactComponent as SearchIcon } from '../../static/images/search.svg';

export default () => (
  <header id="header">
    <div id="inner-header">
      <div className="brand">
        <Link to="/">
          <Image
            height={65}
            src="/images/logo-raster.png"
            webp="/images/logo-raster.webp"
          />
        </Link>
      </div>
      <div className="navigation">
        <NestedMenu location="header-menu"/>

        <Link to="/search" className="search-icon">
          <SearchIcon width={25} height={25} />
        </Link>
      </div>
    </div>
  </header>
);

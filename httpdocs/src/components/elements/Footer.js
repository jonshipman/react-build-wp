import React from 'react';
import { Link } from 'react-router-dom';

import Image from './Image';

export default () => (
  <div className="labs-footer bg-black">
    <p className="white">A Labs project from your friends at</p>
    <Link to="/">
      <Image
        height={65}
        src="/images/logo-raster.png"
        webp="/images/logo-raster.webp"
      />
    </Link>
  </div>
);

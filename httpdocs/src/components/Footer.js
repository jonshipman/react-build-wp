import React from 'react';
import Image from 'react-image-webp';
import { Link } from 'react-router-dom';

const Footer = () => (
  <div className="labs-footer bg-black">
    <p className="white">A Labs project from your friends at</p>
    <Link to="/">
      <Image
        width={128}
        src={require('../static/images/logo-raster.png')}
        webp={require('../static/images/logo-raster.webp')}
        />
    </Link>
  </div>
);

export default Footer;

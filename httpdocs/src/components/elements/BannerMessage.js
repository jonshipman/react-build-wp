import React from 'react';
import { Link } from 'react-router-dom';

const BannerMessage = (props) => (
  <>
    {props.message.length > 0 && (
      <div className="banner-message"><Link to="test">{props.message}</Link></div>
    )}
  </>
);

export default BannerMessage;

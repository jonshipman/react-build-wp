import { Component } from 'react';
import Browser from '../utils/Browser';

class FacebookTracking extends Component {
  componentDidMount = () => {
    if (Browser.isMobile()) {
      setTimeout(this.init, 2500);
    } else {
      this.init();
    }
  }

  init = async () => {
    const { pixel } = this.props;

    (function(f,b,e,v){if(f.fbq)return;let n,t,s;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
      n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)})(window,
      document,'script','https://connect.facebook.net/en_US/fbevents.js');

      window.fbq('init', pixel, {}, {
        "agent": "@apollo/react"
      });

      window.fbq('track', 'PageView', []);
  }

  render() {
    return null;
  }
}

export default FacebookTracking;
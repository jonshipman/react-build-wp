import { Component } from 'react';
import { isMobile } from '../utils/Browser';

export class GoogleTracking extends Component {
  componentDidMount() {
    if (isMobile()) {
      setTimeout(this.init, 2000);
    } else {
      this.init();
    }
  }

  analytics = async (code) => {
    (
      function(i,s,o,g,r){
        i['GoogleAnalyticsObject'] = r;
        i[r] = i[r] || function(){
        (i[r].q=i[r].q||[]).push(arguments)}
        i[r].l=1*new Date();
        let a=s.createElement(o);
        let m=s.getElementsByTagName(o)[0];
        a.defer=1;
        a.async=1;
        a.src=g;
        a.onload = function() {
          window.ga('create', code, 'auto');
          window.ga('send', 'pageview');
        }
        m.parentNode.insertBefore(a,m);
      }
    )(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
  }

  siteTag = async (tag) => {
    window.gTag = tag;

    const scriptGtag = document.createElement('script');
    scriptGtag.async = true;
    scriptGtag.defer = true;
    scriptGtag.src = `https://www.googletagmanager.com/gtag/js?id=${tag}`;
    document.body.appendChild(scriptGtag);

    window.dataLayer = window.dataLayer || []; function gtag(){window.dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', tag);
  }

  tagManager = async (tag) => {
    let dataLayer_content = {"pagePostType":"single-page"};
    window.dataLayer.push( dataLayer_content );

    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!=='dataLayer'?'&l='+l:'';j.defer=true;j.async=true;j.src=
    `//www.googletagmanager.com/gtm.js?id=${i}${dl}`;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer',tag);
  }

  processConversion = id => {
    if (window.gTag) {
      window.dataLayer = window.dataLayer || [];
      function gtag(){window.dataLayer.push(arguments);}

      gtag('event', 'conversion', {'send_to': `${window.gTag}/${id}`});
    } else {
      setTimeout(() => this.processConversion(id), 1000);
    }
  }

  init = () => {
    const { analytics, gtag, tagManager, conversion } = this.props;

    if (analytics) {
      this.analytics(analytics);
    }

    if (gtag) {
      this.siteTag(gtag);
    }

    if (tagManager) {
      this.tagManager(tagManager);
    }

    if (conversion) {
      this.processConversion(conversion);
    }
  }

  render() {
    return null;
  }
}

export class FacebookTracking extends Component {
  componentDidMount() {
    if (isMobile()) {
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

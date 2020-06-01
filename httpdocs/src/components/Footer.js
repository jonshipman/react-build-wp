import React from 'react';
import { gql, useQuery } from '@apollo/client';
import { Link } from 'react-router-dom';

import { BlocksThree } from './layout/Blocks';

import NestedMenu from './elements/NestedMenu';
import Loading from './elements/Loading';
import LoadingError from './elements/LoadingError';

import { ReactComponent as Logo } from '../static/images/logo.svg';
import { ReactComponent as FacebookIcon } from '../static/images/facebook.svg';
import { ReactComponent as YoutubeIcon } from '../static/images/youtube.svg';
import { ReactComponent as LinkedinIcon } from '../static/images/linkedin.svg';
import { ReactComponent as TwitterIcon } from '../static/images/twitter.svg';

const FOOTER_QUERY = gql`
  query SettingsQuery {
    allSettings {
      generalSettingsTitle
      generalSettingsDescription
    }
    headlessWpSettings {
      phoneNumber
      contactEmail
    }
  }
`;

const Footer = ({ settings, desc, title, loading }) => (
  <footer id="footer" className="footer bg-near-white">
    <BlocksThree
      className="footer--inner f7"
      left={(
        <div className="footer--left">
          <div className="brand mb3">
            <Link to="/" className="dib grow-large border-box">
              <Logo className="w5 nb1"/>
            </Link>
          </div>

          <hr className="w2 ml0 b--green bw2 bt-0 bl-0 br-0 mb3" />

          {loading
          ? <Loading />
          : (
            <>
              <div className="desc mv3">{desc}</div>

              {settings.phoneNumber && <div className="phone mv4"><strong>Phone -</strong> {settings.phoneNumber}</div>}

              {settings.contactEmail &&
                <div className="email mt4">
                  <strong>Email - </strong>
                  <a href={`mailto:${settings.contactEmail}`}>{settings.contactEmail}</a>
                </div>
              }
            </>
          )}
        </div>
      )}
      middle={(
        <div className="footer--links">
          <div className="b f4 black mb3">Useful Links</div>
          <hr className="w2 ml0 b--green bw2 bt-0 bl-0 br-0 mb3" />
          <NestedMenu location="footer-menu" className="list pl0 nt3" classNames={{
            li: ['db bl-0 br-0 bt-0 bb b--dashed drop-last-bb b--moon-gray f7'],
            a: ['db pv3 gray hover-green'],
            submenu: ['dn'],
          }}/>
        </div>
      )}
      right={(
        <div className="footer--time-schedule">
          <div className="b f4 black mb3">Get Social</div>
          <hr className="w2 ml0 b--green bw2 bt-0 bl-0 br-0 mb3" />
          <div className="mt2">
            <a className="mr3 dib" aria-label="Facebook" href="https://www.facebook.com/" rel="nofollow noopen" target="_new"><FacebookIcon className="w2 h2" /></a>
            <a className="mr3 dib" aria-label="LinkedIn" href="https://www.linkedin.com/" rel="nofollow noopen" target="_new"><LinkedinIcon className="w2 h2" /></a>
            <a className="mr3 dib" aria-label="Twitter" href="https://www.twitter.com/" rel="nofollow noopen" target="_new"><TwitterIcon className="w2 h2" /></a>
            <a className="dib" aria-label="Youtube" href="https://www.youtube.com/" rel="nofollow noopen" target="_new"><YoutubeIcon className="w2 h2" /></a>
          </div>
        </div>
      )}
    />
    <div className="copyright bg-near-black gray f7 tc pv4">
      <p>Copyright &copy; {(new Date()).getFullYear()} &bull; {title}. All Rights Reserved</p>
    </div>
  </footer>
);

export default () => {
  const { loading, error, data } = useQuery(FOOTER_QUERY);

  if (loading) return <Footer loading={true} title={<Loading />} />
  if (error) return <LoadingError error={error.message} />;

  return (
    <Footer
      settings={data.headlessWpSettings}
      desc={data.allSettings.generalSettingsDescription}
      title={data.allSettings.generalSettingsTitle}
    />
  );
}
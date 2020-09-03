import React from "react";
import { gql, useQuery } from "@apollo/client";
import { Link } from "react-router-dom";
import {
  FlatMenu,
  Loading,
  LoadingError,
  PageWidth,
} from "react-boilerplate-nodes";

import { ReactComponent as FacebookIcon } from "../static/images/facebook.svg";
import { ReactComponent as LinkedinIcon } from "../static/images/linkedin.svg";
import { ReactComponent as Logo } from "../static/images/logo.svg";
import { ReactComponent as TwitterIcon } from "../static/images/twitter.svg";
import { ReactComponent as YoutubeIcon } from "../static/images/youtube.svg";

const FOOTER_QUERY = gql`
  query SettingsQuery {
    allSettings {
      id
      generalSettingsTitle
      generalSettingsDescription
    }
    headlessWpSettings {
      id
      phoneNumber
      contactEmail
    }
  }
`;

const FooterRender = ({ settings, desc, title, loading }) => {
  return (
    <footer id="footer" className="footer bg-near-white">
      <PageWidth className="overflow-hidden">
        <div className="flex-l f7 mv4 nl4 nr4">
          <div className="w-third-l pa4">
            <div className="brand mb3">
              <Link to="/" className="dib border-box">
                <Logo className="w5 fill-primary" />
              </Link>
            </div>

            <hr className="w2 ml0 b--primary bw2 bt-0 bl-0 br-0 mb3" />

            {loading ? (
              <Loading />
            ) : (
              <>
                <div className="mv3">{desc}</div>

                {settings.phoneNumber && (
                  <div className="mt4">
                    <strong>Phone -</strong> {settings.phoneNumber}
                  </div>
                )}

                {settings.contactEmail && (
                  <div className="mt4">
                    <strong>Email - </strong>
                    <a href={`mailto:${settings.contactEmail}`}>
                      {settings.contactEmail}
                    </a>
                  </div>
                )}
              </>
            )}
          </div>
          <div className="w-third-l pa4">
            <div className="b f4 black mb3">Useful Links</div>
            <hr className="w2 ml0 b--primary bw2 bt-0 bl-0 br-0 mb3" />
            <FlatMenu location="FOOTER_MENU" className="nt3 f5" />
          </div>
          <div className="w-third-l pa4">
            <div className="b f4 black mb3">Get Social</div>
            <hr className="w2 ml0 b--primary bw2 bt-0 bl-0 br-0 mb3" />
            <div className="mt2">
              <a
                className="mr3 dib"
                aria-label="Facebook"
                href="https://www.facebook.com/"
                rel="nofollow noopen"
                target="_new"
              >
                <FacebookIcon className="w2 h2" />
              </a>
              <a
                className="mr3 dib"
                aria-label="LinkedIn"
                href="https://www.linkedin.com/"
                rel="nofollow noopen"
                target="_new"
              >
                <LinkedinIcon className="w2 h2" />
              </a>
              <a
                className="mr3 dib"
                aria-label="Twitter"
                href="https://www.twitter.com/"
                rel="nofollow noopen"
                target="_new"
              >
                <TwitterIcon className="w2 h2" />
              </a>
              <a
                className="dib"
                aria-label="Youtube"
                href="https://www.youtube.com/"
                rel="nofollow noopen"
                target="_new"
              >
                <YoutubeIcon className="w2 h2" />
              </a>
            </div>
          </div>
        </div>
      </PageWidth>
      <div className="copyright bg-near-black gray f7 tc pv2">
        <p>
          Copyright &copy; {new Date().getFullYear()} &bull; {title}. All Rights
          Reserved
        </p>
      </div>
    </footer>
  );
};

const Footer = () => {
  const { loading, error, data } = useQuery(FOOTER_QUERY, {
    errorPolicy: "all",
  });

  if (loading) return <FooterRender loading={true} title={<Loading />} />;
  if (error) return <LoadingError error={error.message} />;

  return (
    <FooterRender
      settings={data?.headlessWpSettings}
      desc={data?.allSettings?.generalSettingsDescription}
      title={data?.allSettings?.generalSettingsTitle}
    />
  );
};

export default Footer;

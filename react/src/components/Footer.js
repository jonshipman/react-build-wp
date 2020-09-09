import React from "react";
import { Link } from "react-router-dom";
import { FlatMenu, Loading, PageWidth } from "react-boilerplate-nodes";

import { ReactComponent as FacebookIcon } from "../static/images/facebook.svg";
import { ReactComponent as LinkedinIcon } from "../static/images/linkedin.svg";
import { ReactComponent as Logo } from "../static/images/logo.svg";
import { ReactComponent as TwitterIcon } from "../static/images/twitter.svg";
import { ReactComponent as YoutubeIcon } from "../static/images/youtube.svg";
import useSettings from "./hooks/useSettings";

const FooterColumn1 = () => {
  const { phone, email, description, loading } = useSettings();
  return (
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
          <div className="mv3">{description}</div>

          {phone && (
            <div className="mt4">
              <strong>Phone -</strong> {phone}
            </div>
          )}

          {email && (
            <div className="mt4">
              <strong>Email - </strong>
              <a href={`mailto:${email}`}>{email}</a>
            </div>
          )}
        </>
      )}
    </div>
  );
};

const FooterColumn2 = () => {
  return (
    <div className="w-third-l pa4">
      <div className="b f4 black mb3">Useful Links</div>
      <hr className="w2 ml0 b--primary bw2 bt-0 bl-0 br-0 mb3" />
      <FlatMenu location="FOOTER_MENU" className="nt3 f5" />
    </div>
  );
};

const Icon = ({ label, href, svgIcon: SvgIcon }) => {
  return (
    <a
      className="mr3 dib"
      aria-label={label}
      href={href}
      rel="nofollow noopen"
      target="_new"
    >
      <SvgIcon className="w2 h2 fill-primary hover-fill-secondary" />
    </a>
  );
};

const FooterColumn3 = () => {
  return (
    <div className="w-third-l pa4">
      <div className="b f4 black mb3">Get Social</div>
      <hr className="w2 ml0 b--primary bw2 bt-0 bl-0 br-0 mb3" />
      <div className="mt2">
        <Icon
          svgIcon={FacebookIcon}
          href="https://www.facebook.com/"
          label="Facebook"
        />
        <Icon
          svgIcon={LinkedinIcon}
          href="https://www.linkedin.com/"
          label="LinkedIn"
        />
        <Icon
          svgIcon={TwitterIcon}
          href="https://www.twitter.com/"
          label="Twitter"
        />
        <Icon
          svgIcon={YoutubeIcon}
          href="https://www.youtube.com/"
          label="Youtube"
        />
      </div>
    </div>
  );
};

const Footer = () => {
  const { title = " ... " } = useSettings();

  return (
    <footer id="footer" className="footer bg-near-white">
      <PageWidth className="overflow-hidden">
        <div className="flex-l f7 mv4 nl4 nr4">
          <FooterColumn1 />
          <FooterColumn2 />
          <FooterColumn3 />
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

export default Footer;

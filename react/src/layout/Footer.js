import React from "react";
import { FlatMenu, PageWidth } from "react-wp-gql";
import { useSettings } from "../hooks";

const FooterColumn = ({ children, className = "" }) => (
  <div className={`w-100 w-third-l ${className}`}>{children}</div>
);

export const Footer = () => {
  const { generalSettingsTitle, generalSettingsDescription } = useSettings();

  return (
    <footer id="footer">
      <div className="bg-gray white">
        <PageWidth>
          <div className="flex-l pv4">
            <FooterColumn>
              <div className="f3 mb2">{generalSettingsTitle}</div>
              <div>{generalSettingsDescription}</div>
            </FooterColumn>
            <FooterColumn className="ml-auto-l tr-l">
              <div className="f3 mb2">Menu</div>
              <nav>
                <FlatMenu location="FOOTER_MENU" className="pl0 list lh-copy" />
              </nav>
            </FooterColumn>
          </div>
        </PageWidth>
      </div>
      <div className="f7 white bg-mid-gray pv4">
        <PageWidth>
          <div className="flex-l items-center-l">
            <div>
              Copyright {new Date().getFullYear()}{" "}
              {generalSettingsTitle ? ` - ${generalSettingsTitle}` : "..."}
              <span> | All rights reserved</span>
            </div>

            <div className="ml-auto-l"></div>
          </div>
        </PageWidth>
      </div>
    </footer>
  );
};

import React from "react";
import { PageWidth } from "react-wp-gql";
import { useSettings } from "../hooks";
import { gql, useQuery } from "@apollo/client";
import { Link } from "react-router-dom";

const FooterMenu = gql`
  query FooterMenu {
    menuItems(where: { location: FOOTER_MENU }) {
      nodes {
        id
        url
        label
        connectedNode {
          node {
            __typename
          }
        }
      }
    }
  }
`;

function MenuLink({ url, label, connectedNode }) {
  let Tag = "a";
  const props = { className: "color-inherit no-underline" };
  const type = connectedNode?.node?.__typename || "MenuItem";

  if (type === "MenuItem") {
    props.href = url;
  } else {
    Tag = Link;
    props.to = url.replace(/^.*\/\/[^/]+/, "");
  }

  return <Tag {...props}>{label}</Tag>;
}

function FooterColumn({ children, className = "" }) {
  return <div className={`w-100 w-third-l ${className}`}>{children}</div>;
}

export function Footer() {
  const { title, description } = useSettings();
  const { data } = useQuery(FooterMenu);
  const menu = data?.menuItems?.nodes || [];

  return (
    <footer id="footer">
      <div className="bg-gray white">
        <PageWidth>
          <div className="flex-l pv4">
            <FooterColumn>
              <div className="f3 mb2">{title}</div>
              <div>{description}</div>
            </FooterColumn>
            <FooterColumn className="ml-auto-l tr-l">
              <nav className="lh-copy">
                {menu.map((node) => (
                  <MenuLink key={node.id} {...node} />
                ))}
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
              {title ? ` - ${title}` : "..."}
              <span> | All rights reserved</span>
            </div>

            <div className="ml-auto-l"></div>
          </div>
        </PageWidth>
      </div>
    </footer>
  );
}

export default Footer;

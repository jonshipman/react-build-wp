import React from "react";
import { PageWidth, Menu } from "react-boilerplate-nodes";
import { Link } from "react-router-dom";

export const Header = () => (
  <header id="header">
    <PageWidth>
      <nav className="flex -l items-center-l w-100">
        <div>
          <Link to="/" className="no-underline color-inherit">
            Logo
          </Link>
        </div>
        <Menu location="HEADER_MENU" className="dn db-l ma0 f6 ml-auto-l" />
      </nav>
    </PageWidth>
  </header>
);

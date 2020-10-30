import React, { useState } from "react";
import { PageWidth, Menu } from "react-boilerplate-nodes";
import { Link } from "react-router-dom";

export const Header = () => {
  const [open, setOpen] = useState();

  return (
    <header id="header">
      <PageWidth>
        <nav className="flex-l items-center-l w-100">
          <div className="flex items-center db-l">
            <div
              className="db dn-l pointer mr3 ma2"
              onClick={() => setOpen(!open)}
            >
              {Array.from(new Array(3)).map((_, i) => (
                <div
                  key={`menu-toggle-${i}`}
                  className="w2 bg-near-black pb1 mt1 mb1"
                />
              ))}
            </div>
            <div>
              <Link to="/" className="no-underline color-inherit">
                Logo
              </Link>
            </div>
          </div>
          <Menu
            onClick={() => setOpen(false)}
            location="HEADER_MENU"
            className={`${open ? "db" : "dn db-l"} ma0 f6 ml-auto-l`}
          />
        </nav>
      </PageWidth>
    </header>
  );
};

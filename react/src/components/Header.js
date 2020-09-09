import React, { useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { PageWidth, Menu } from "react-boilerplate-nodes";

import { ReactComponent as Logo } from "../static/images/logo.svg";

const Header = () => {
  const menuRef = useRef();

  const openMenu = useCallback(
    (props = {}) => {
      const { current: menuElement } = menuRef || {};
      const { close } = props;

      if (menuElement) {
        const { classList } = menuElement;
        if (!classList.contains("dn") || close === true) {
          classList.add("dn");
        } else {
          classList.remove("dn");
        }
      }
    },
    [menuRef]
  );

  return (
    <header id="header">
      <div className="w-100 z-2 relative">
        <div className="bg-white">
          <nav>
            <PageWidth className="flex-l items-center-l">
              <div className="brand flex items-center tc tl-l">
                <div
                  className="mobile-toggle pr3 pv3 db dn-l"
                  onClick={openMenu}
                >
                  {Array.from(new Array(3)).map((_, i) => (
                    <div
                      key={`menu-toggle-${i}`}
                      className="w2 bg-black-60 pb1 mt1 mb1"
                    />
                  ))}
                </div>
                <Link
                  to="/"
                  className="dib border-box mv3"
                  onClick={() => openMenu({ close: true })}
                >
                  <Logo className="w4 fill-primary" />
                </Link>
              </div>
              <div className="db tc tr-l ml-auto-l">
                <Menu
                  ref={menuRef}
                  location="HEADER_MENU"
                  className="dn ma0 db-l dark-gray f6"
                  anchorOnClick={openMenu}
                />
              </div>
            </PageWidth>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;

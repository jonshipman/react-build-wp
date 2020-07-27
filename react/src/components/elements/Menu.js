import React, { forwardRef } from "react";
import { gql, useQuery } from "@apollo/client";
import { NavLink } from "react-router-dom";

/**
 * Loading functional component that loads the skeleton, error,
 * or finished component based on results.
 */
const Menu = forwardRef((props, ref) => {
  const { error, loading, data } = useQuery(MENU_QUERY, {
    variables: { location: props.location },
  });

  return (
    <OnQueryFinished
      forwardedRef={ref}
      loading={loading}
      error={error}
      {...props}
      menuItems={
        data?.menus?.nodes?.length > 0 &&
        data.menus.nodes[0].menuItems?.nodes?.length > 0
          ? data.menus.nodes[0].menuItems.nodes
          : []
      }
    />
  );
});

Menu.defaultProps = {
  location: "HEADER_MENU",
  ignoreClasses: false,
  anchorOnclick: () => {},
};

/**
 * Menu query that returns the nested menu items.
 */
const MENU_QUERY = gql`
  query MenuQuery($location: MenuLocationEnum!) {
    menus(where: { location: $location }) {
      nodes {
        id
        menuItems(first: 100) {
          nodes {
            id
            databaseId
            parentId
            url
            label
            cssClasses
            connectedObject {
              __typename
            }
            childItems {
              nodes {
                id
                parentId
              }
            }
          }
        }
      }
    }
  }
`;

/**
 * Component that loads the UL and loops the child item from the menu query.
 */
const OnQueryFinished = ({ forwardedRef, loading, children, ...props }) => (
  <ul
    ref={forwardedRef}
    id={`menu-${props.location.toLowerCase().replace("_", "-")}`}
    className={`nested-menu ${props.className}`}
    style={{ touchAction: "pan-y" }}
  >
    {loading || props.error?.message ? (
      <Skeleton {...props} />
    ) : (
      props.menuItems.map((menuItem) => {
        if (null === menuItem.parentId) {
          return <ChildItem key={menuItem.id} menuItem={menuItem} {...props} />;
        } else {
          return null;
        }
      })
    )}
    {children}
  </ul>
);

/**
 * Child item that loops to created the nested menu.
 */
const ChildItem = ({ menuItem, level, ...props }) => {
  const { menuItems } = props;
  const hasChildren = menuItem?.childItems?.nodes?.length > 0;
  let localLevel = level ? level + 1 : 1;
  let new_children = [];

  if (hasChildren) {
    menuItem.childItems.nodes.forEach((childItem) => {
      new_children.push(menuItems.find((i) => i.id === childItem.id));
    });
  }

  const menuItemProps = {};
  if (
    undefined === menuItem?.connectedObject?.__typename ||
    "MenuItem" === menuItem?.connectedObject?.__typename
  ) {
    menuItemProps.href = menuItem.url;
  } else {
    menuItemProps.to = menuItem.url;
  }

  if (hasChildren) {
    menuItemProps.submenu = (
      <SubMenu>
        {new_children.map((m) => {
          if (m.parentId === menuItem.id) {
            return (
              <ChildItem
                key={m.id}
                menuItem={m}
                level={localLevel}
                {...props}
              />
            );
          } else {
            return null;
          }
        })}
      </SubMenu>
    );
  }

  return (
    <MenuItem
      onClick={props.anchorOnclick}
      key={menuItem.id}
      level={localLevel}
      className={`${menuItem.cssClasses} ${hasChildren ? "has-children" : ""}`}
      id={`menu-item ${menuItem.databaseId}`}
      {...menuItemProps}
    >
      {menuItem.label}
    </MenuItem>
  );
};

// Exportable menu item container.
export const MenuItem = ({
  id,
  level = "1",
  className = "",
  href,
  to,
  children,
  onClick,
  submenu,
}) => (
  <li id={id} className={`menu-item level-${level} ${className}`}>
    {href ? (
      <a href={href} rel="nofollow noopen">
        <span className="link-inner">{children}</span>
      </a>
    ) : (
      <NavLink exact to={to} onClick={onClick} activeClassName="current-item">
        <span className="link-inner">{children}</span>
      </NavLink>
    )}
    {submenu}
  </li>
);

// Exportable submenu container.
export const SubMenu = ({ className = "", children }) => (
  <ul className={`sub-menu dn ${className}`}>{children}</ul>
);

/**
 * The placeholder skeleton that shows before query loads.
 */
const Skeleton = ({ error }) => {
  return Array.from(new Array(error?.message ? 1 : 5)).map(() => (
    <li key={Math.random()}>
      <a href="/">
        {error?.message ? (
          error.message
        ) : (
          <span className="h1 w3 ml2 loading-block dib" />
        )}
      </a>
    </li>
  ));
};

export default Menu;

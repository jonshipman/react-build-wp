import React, { forwardRef } from "react";
import { gql, useQuery } from "@apollo/client";
import { NavLink } from "react-router-dom";

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
 * Child item that loops to created the nested menu.
 */
const ChildItem = ({ menuItem, level, anchorOnClick = () => {}, ...props }) => {
  const { menuItems } = props;
  const hasChildren = menuItem?.childItems?.nodes?.length > 0;
  let localLevel = level ? level + 1 : 1;
  let new_children = [];

  if (hasChildren) {
    menuItem.childItems.nodes.forEach((childItem) => {
      new_children.push(menuItems.find((i) => i.id === childItem.id));
    });
  }

  const menuItemProps = {
    className: menuItem.cssClasses || "",
  };

  if (
    undefined === menuItem?.connectedObject?.__typename ||
    "MenuItem" === menuItem?.connectedObject?.__typename
  ) {
    menuItemProps.href = menuItem.url;
  } else {
    menuItemProps.to = menuItem.url;
  }

  if (hasChildren) {
    menuItemProps.className += " has-children";
    menuItemProps.submenu = (
      <SubMenu>
        {new_children.map((m) => {
          if (m.parentId === menuItem.id) {
            return (
              <ChildItem
                key={m.id}
                menuItem={m}
                level={localLevel}
                anchorOnClick={anchorOnClick}
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
      onClick={anchorOnClick}
      key={menuItem.id}
      level={localLevel}
      id={`menu-item ${menuItem.databaseId}`}
      flat={props.flat}
      {...menuItemProps}
    >
      {menuItem.label}
    </MenuItem>
  );
};

// Exportable menu item container.
export const MenuItem = ({
  id,
  level = 1,
  className = "",
  href,
  to,
  children,
  flat = false,
  onClick = () => {},
  submenu,
}) => {
  let anchorClass = "";

  if (!flat) {
    anchorClass = "color-inherit no-underline db";
    className += " hide-child-l";

    if (1 === level) {
      className += " dib-l pv3-l hover-z-2 drop-last-child-pr";
      anchorClass += " ttu-l pv2 ph3-l hover-silver";
    } else {
      className += " nowrap";
      anchorClass += " pa2 gray hover-blue";
    }
  } else {
    className += " pv2";
  }

  const TransformedSubmenu = submenu
    ? () => <submenu.type level={level} flat={flat} {...submenu.props} />
    : () => null;

  return (
    <li
      id={id}
      className={`menu-item level-${level} db relative z-1 ${className}`}
    >
      {href ? (
        <a href={href} rel="nofollow noopen" className={anchorClass}>
          <span className="link-inner">{children}</span>
        </a>
      ) : (
        <NavLink
          exact
          to={to}
          onClick={onClick}
          className={anchorClass}
          activeClassName="current-item"
        >
          <span className="link-inner">{children}</span>
        </NavLink>
      )}
      <TransformedSubmenu />
    </li>
  );
};

// Exportable submenu container.
export const SubMenu = ({
  className = "",
  level = 1,
  flat = false,
  children,
}) => {
  if (!flat) {
    className += " child bg-white absolute-l z-1";
    if (1 === level) {
      className += " ba-l b--light-gray w5-l tl-l top-100-l left-0-l";
    } else {
      className += " left-100 top-0";
    }
  } else {
    className += " dn";
  }

  return <ul className={`sub-menu list pl0 ${className}`}>{children}</ul>;
};

/**
 * The placeholder skeleton that shows before query loads.
 */
const Skeleton = ({ error, ...props }) => {
  return Array.from(new Array(error?.message ? 1 : 5)).map(() => (
    <MenuItem key={Math.random()} href="/" {...props}>
      {error?.message ? (
        error.message
      ) : (
        <span className="h1 w3 ml2 loading-block dib" />
      )}
    </MenuItem>
  ));
};

/**
 * Component that loads the UL and loops the child item from the menu query.
 */
const OnQueryFinished = ({
  forwardedRef,
  loading,
  children,
  className = "",
  ...props
}) => (
  <ul
    ref={forwardedRef}
    id={`menu-${props.location.toLowerCase().replace("_", "-")}`}
    className={`nested-menu list pl0 ${className}`}
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
 * Loads a flat menu without hover classes.
 */
export const FlatMenu = forwardRef(
  ({ location = "HEADER_MENU", ...props }, ref) => {
    const { error, loading, data } = useQuery(MENU_QUERY, {
      variables: { location },
    });

    return (
      <OnQueryFinished
        forwardedRef={ref}
        loading={loading}
        error={error}
        flat={true}
        location={location}
        {...props}
        menuItems={
          data?.menus?.nodes?.length > 0 &&
          data.menus.nodes[0].menuItems?.nodes?.length > 0
            ? data.menus.nodes[0].menuItems.nodes
            : []
        }
      />
    );
  }
);

/**
 * Loading functional component that loads the skeleton, error,
 * or finished component based on results.
 */
export default forwardRef(({ location = "HEADER_MENU", ...props }, ref) => {
  const { error, loading, data } = useQuery(MENU_QUERY, {
    variables: { location },
  });

  return (
    <OnQueryFinished
      forwardedRef={ref}
      loading={loading}
      error={error}
      location={location}
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

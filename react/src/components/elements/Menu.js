import React, { forwardRef } from 'react';
import { gql, useQuery } from '@apollo/client';
import { NavLink } from 'react-router-dom';

/**
 * Loading functional component that loads the skeleton, error,
 * or finished component based on results.
 */
const Menu = forwardRef(({ classNames, ...props }, ref) => {
  let _classNames = { ...defaultClasses, ...classNames };

  const { error, loading, data } = useQuery(MENU_QUERY, {
    variables: { location: props.location }
  });

  return <OnQueryFinished
    forwardedRef={ref}
    loading={loading}
    error={error}
    { ...props }
    classNames={_classNames}
    menuItems={data?.menus?.nodes?.length > 0 && data.menus.nodes[0].menuItems?.nodes?.length > 0 ? data.menus.nodes[0].menuItems.nodes : []}
  />
});

/**
 * Default properties.
 */
const defaultClasses = {
  li: [
    'db dib-l relative z-1 hover-z-2 pv3 drop-last-child-pr',
    'pa2 relative z-1 hover-z-2',
    'pa2 nowrap'
  ],
  a: [
    'fw4 hover-blue no-underline color-inherit dib pv2 ph3',
    'hover-blue dark-gray db'
  ],
  submenu: [
    'tl-l list pl0 absolute-l pv2 top-100-l left-0-l bg-white ba b--light-gray w5',
    'list ph3 absolute-l top-0-l left-100-l bg-white ba b--light-gray'
  ],
};

Menu.defaultProps = {
  location: 'HEADER_MENU',
  ignoreClasses: false,
  classNames: defaultClasses,
  anchorOnclick: () => {}
};

/**
 * Menu query that returns the nested menu items.
 */
const MENU_QUERY = gql`
  query MenuQuery($location: MenuLocationEnum!) {
    menus(where: {location: $location}) {
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
const OnQueryFinished = ({ forwardedRef, loading, ...props }) => (
  <ul
    ref={forwardedRef}
    id={`menu-${props.location.toLowerCase().replace('_','-')}`}
    className={`nested-menu ${props.className}`}
    style={{touchAction: 'pan-y'}}
  >
    {loading || props.error?.message
    ? <Skeleton { ...props } />
    : props.menuItems.map(menuItem => {
        if (null === menuItem.parentId) {
          return <ChildItem key={menuItem.id} menuItem={menuItem} { ...props } />
        } else {
          return null;
        }
      })
    }
  </ul>
);

/**
 * Child item that loops to created the nested menu.
 */
const ChildItem = ({ menuItem, level, ...props }) => {
  const { menuItems, classNames } = props;
  const hasChildren = menuItem?.childItems?.nodes?.length > 0;
  let localLevel = level ? level + 1 : 1;
  let new_children = [];

  if (hasChildren) {
    menuItem.childItems.nodes.forEach(childItem => {
      new_children.push(menuItems.find(i => i.id === childItem.id));
    });
  }

  let liClassName = '';
  let aClassName = '';
  let submenuClassName = '';

  if (!props.ignoreClasses) {
    liClassName = `menu-item ${(hasChildren ? ' has-children' : '')} level-${localLevel}`;
    submenuClassName = 'dn';

    if (classNames.li[localLevel-1]) {
      liClassName += ' ' + classNames.li[localLevel-1];
    }

    if (classNames.a[localLevel-1]) {
      aClassName += ' ' + classNames.a[localLevel-1];
    }

    if (classNames.submenu[localLevel-1]) {
      submenuClassName += ' ' + classNames.submenu[localLevel-1];
    }
  }

  return (
    <li
      id={'menu-item-' + menuItem.databaseId}
      key={ menuItem.id }
      className={`${liClassName} ${menuItem.cssClasses || ''}`}
    >
      {'MenuItem' === menuItem.connectedObject.__typename
        ?
          <a href={menuItem.url} className={aClassName} rel="nofollow noopen">
            <span className="link-inner">{menuItem.label}</span>
          </a>
        :
          <NavLink exact to={menuItem.url} className={aClassName} onClick={props.anchorOnclick} activeClassName="current-item">
            <span className="link-inner">{menuItem.label}</span>
          </NavLink>
      }
      {hasChildren ? (
        <ul className={`sub-menu dn ${submenuClassName}`}>
          {new_children.map(m => {
            if (m.parentId === menuItem.id) {
              return (
                <ChildItem
                  key={m.id}
                  menuItem={m}
                  level={localLevel}
                  { ...props }
                />
              );
            } else {
              return null;
            }
          })}
        </ul>
      ) : (
        null
      )}
    </li>
  );
};

/**
 * The placeholder skeleton that shows before query loads.
 */
const Skeleton = ({ classNames, ignoreClasses, error }) => {
  return Array.from(new Array(error?.message ? 1 : 5)).map(() => (
    <li
      key={Math.random()}
      className={!ignoreClasses && classNames?.li?.length > 0 ? `menu-item level-1 ${classNames.li[0]}` : 'menu-item level-1'}
    >
      <span className={!ignoreClasses && classNames?.a?.length > 0 ? classNames.a[0] : ''} >
        {error?.message
        ? error.message
        : <span className="h1 w3 ml2 loading-block dib" />
        }
      </span>
    </li>
  ));
}

export default Menu;

import React from 'react';
import { gql, useQuery } from '@apollo/client';
import { Link } from 'react-router-dom';

import Loading from './Loading';
import LoadingError from './LoadingError';

/**
 * GraphQL menu query
 * Gets the labels, types (internal or external) and URLs
 */
const MENU_QUERY = gql`
  query MenuQuery($location: String!) {
    nestedMenu(name: $location) {
      url
      label
      type
      itemID
      parent
      hasChildren
      children
    }
  }
`;

const defaultClasses = {
  primary: {
    li: 'dib relative z-1 hover-z-2 pv3',
    a: 'f6 fw4 hover-green no-underline dark-gray dn dib-l pv2 ph3',
    submenu: 'tl list pl0 absolute pv3 top-100 left-0 bg-white ba b--light-gray w5'
  },
  secondary: {
    li: 'pa2 relative z-1 hover-z-2',
    a: 'hover-green dark-gray db',
    submenu: 'list ph3 absolute top-0 left-100 bg-white ba b--light-gray'
  },
  tertiary: {
    li: 'pa2 nowrap'
  }
}

const ChildItem = ({ menu, level, ...props }) => {
  const { menus, classNames } = props;
  let localLevel = level ? level + 1 : 1;

  let new_children = [];

  if ( menu.hasChildren ) {
    menu.children.forEach( ( id ) => {
      new_children.push( menus.find( i => i.itemID === id ) );
    } );
  }

  let liClassName = '';
  let aClassName = '';
  let submenuClassName = '';

  if (!props.ignoreClasses) {
    liClassName = `menu-item ${(menu.hasChildren ? ' has-children' : '')} level-${localLevel}`;
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
      id={ 'menu-item-' + menu.itemID }
      key={ 'menu-item-' + menu.itemID }
      className={liClassName}
    >
      {menu.type === 'custom'
        ?
          <a href={menu.url} className={aClassName} rel="nofollow noopen">
            <span className="link-inner">{menu.label}</span>
          </a>
        :
          <Link to={menu.url} className={aClassName}>
            <span className="link-inner">{menu.label}</span>
          </Link>
      }
      {menu.hasChildren ? (
        <ul className={`sub-menu dn ${submenuClassName}`}>
          {new_children.map(m => {
            if (m.parent === menu.itemID) {
              return (
                <ChildItem
                  key={ 'menu-item-' + m.itemID }
                  menu={m}
                  level={localLevel}
                  { ...props }
                />
              );
            } else {
              return false;
            }
          })}
        </ul>
      ) : (
        false
      )}
    </li>
  );
};

const OnQueryFinished = props => (
  <ul id={`menu-${props.location}`} className={`nested-menu ${props.className}`} style={{touchAction: 'pan-y'}}>

    {props.menus.map(menu => {
      if (menu.parent === 0) {
        return (
          <ChildItem key={menu.itemID} menu={menu} { ...props } />
        );
      } else {
        return false;
      }
    })}

  </ul>
);

OnQueryFinished.defaultProps = {
  menus: [],
  location: 'header-menu',
  ignoreClasses: false,
  classNames: {
    li: [
      defaultClasses.primary.li,
      defaultClasses.secondary.li,
      defaultClasses.tertiary.li
    ],
    a: [
      defaultClasses.primary.a,
      defaultClasses.secondary.a
    ],
    submenu: [
      defaultClasses.primary.submenu,
      defaultClasses.secondary.submenu
    ]
  }
};

export default props => {
  const { loading, error, data } = useQuery(MENU_QUERY, {
    variables: { location: props.location }
  });

  if (loading) return <Loading className="f7" />;
  if (error) return <LoadingError error={error.message} />;

  const menus = data.nestedMenu;

  return <OnQueryFinished menus={menus} { ...props } />
}

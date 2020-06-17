import React from 'react';
import { gql, useQuery } from '@apollo/client';
import { Link } from 'react-router-dom';

import LoadingError from './LoadingError';

/**
 * Loading functional component that loads the skeleton, error,
 * or finished component based on results.
 */
const NestedMenu = props => {
  const { loading, error, data } = useQuery(MENU_QUERY, {
    variables: { location: props.location }
  });

  if (loading) return <Skeleton { ...props } />
  if (error) return <LoadingError error={error.message} />

  const menus = data.nestedMenu;

  return <OnQueryFinished { ...props } menus={menus} />
}

/**
 * Default properties.
 */
const defaultClasses = {
  li: [
    'db dib-l relative z-1 hover-z-2 pv3',
    'pa2 relative z-1 hover-z-2',
    'pa2 nowrap'
  ],
  a: [
    'f6 fw4 hover-blue no-underline dark-gray dib pv2 ph3',
    'hover-blue dark-gray db'
  ],
  submenu: [
    'tl-l list pl0 absolute-l pv3 top-100-l left-0-l bg-white ba b--light-gray w5',
    'list ph3 absolute-l top-0-l left-100-l bg-white ba b--light-gray'
  ],
};

NestedMenu.defaultProps = {
  location: 'header-menu',
  ignoreClasses: false,
  classNames: defaultClasses,
  anchorOnclick: () => {}
};

/**
 * Menu query that returns the nested menu items.
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

/**
 * Child item that loops to created the nested menu.
 */
const ChildItem = ({ menu, level, ...props }) => {
  const { menus } = props;

  let classNames = defaultClasses;
  Object.assign( classNames, props.classNames );

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
          <Link to={menu.url} className={aClassName} onClick={props.anchorOnclick}>
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

/**
 * The placeholder skeleton that shows before query loads.
 */
const Skeleton = props => {
  let classNames = defaultClasses;
  Object.assign( classNames, props.classNames );

  return (
    <ul
      id={`menu-${props.location}`}
      className={`nested-menu ${props.className}`}
      style={{touchAction: 'pan-y'}}
    >
      {Array.from(new Array(5)).map(() => (
        <li
          key={Math.random()}
          className={!props.ignoreClasses && classNames ? `menu-item level-1 ${classNames.li[0]}` : ''}
        >
          <div className={!props.ignoreClasses && classNames ? classNames.a[0] : ''} >
            <span className="h1 w3 ml2 loading-block db" />
          </div>
        </li>
      ))}
    </ul>
  );
}

/**
 * Component that loads the UL and loops the child item from the menu query.
 */
const OnQueryFinished = props => (
  <ul
    id={`menu-${props.location}`}
    className={`nested-menu ${props.className}`}
    style={{touchAction: 'pan-y'}}
  >

    {props.menus.map(menu => {
      if (menu.parent === 0) {
        return <ChildItem key={menu.itemID} menu={menu} { ...props } />
      } else {
        return false;
      }
    })}

  </ul>
);

export default NestedMenu;

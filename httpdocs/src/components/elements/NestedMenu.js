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

const ChildItem = (props) => {
  const { menu, menus } = props;

  let new_children = [];

  if ( menu.hasChildren ) {
    menu.children.forEach( ( id ) => {
      new_children.push( menus.find( i => i.itemID === id ) );
    } );
  }

  return (
    <li id={ 'menu-item-' + menu.itemID } key={ 'menu-item-' + menu.itemID } className={(menu.hasChildren ? ' has-children' : '')}>
      <Link to={menu.url} className="sf-with-ul">
        <span className="link-inner">{menu.label}</span>
      </Link>
      {menu.hasChildren ? (
        <ul className="sub-menu dn">
          {new_children.map(m => {
            if (m.parent === menu.itemID) {
              return (
                <ChildItem key={ 'menu-item-' + m.itemID } menu={m} menus={menus} />
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

const OnQueryFinished = props => {
  const { menus, location } = props;

  return (
    <ul id={ 'menu-' + location } style={{touchAction: 'pan-y'}}>

      {menus.map(menu => {
        if (menu.parent === 0) {
          return (
            <ChildItem key={menu.itemID} menu={menu} menus={menus} />
          );
        } else {
          return false;
        }
      })}

    </ul>
  );
}

export default props => {
  const { location } = props;

  const { loading, error, data } = useQuery(MENU_QUERY, {
    variables: { location }
  });

  if (loading) return <Loading />;
  if (error) return <LoadingError error={error.message} />;

  const menus = data.nestedMenu;

  return <OnQueryFinished menus={menus} location={location} />
}

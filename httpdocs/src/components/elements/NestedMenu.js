import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import gql from 'graphql-tag';
import { withApollo } from 'react-apollo';
import { compose } from 'recompose';

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

class NestedMenu extends Component {
  state = {
    menus: [],
    location: '',
  };

  componentDidMount = () => {
    this.executeMenu();
  }

  /**
   * Execute the menu query, parse the result and set the state
   */
  executeMenu = async () => {
    const { client, location } = this.props;

    const result = await client.query({
      query: MENU_QUERY,
      variables: { location },
    });
    const menus = result.data.nestedMenu;
    this.setState({ menus, location });
  };

  render() {
    const { menus, location } = this.state;

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
}

export default compose(
  withApollo
)(NestedMenu);


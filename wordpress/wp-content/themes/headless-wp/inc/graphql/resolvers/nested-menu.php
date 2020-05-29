<?php
/**
 * Menu GraphQL resolver.
 *
 * @package Postlight_Headless_WP
 */

require_once __DIR__ . '/../types/nested-menu.php';

/**
 * Get menu items
 */
function postlight_headless_wp_get_menu( $name ) {
    if ( null === $name ) {
        $name = 'header-menu';
    }

    $counter = 0;
    $resolve = array();

    $theme_locations = get_nav_menu_locations();

    if ( isset( $theme_locations[ $name ] ) ) {
        $menu_obj = get_term( $theme_locations[ $name ], 'nav_menu' );

        if ( $menu_obj && ! is_wp_error( $menu_obj ) ) {
            $menu_name  = $menu_obj->name;
            $menu_items = wp_get_nav_menu_items( $menu_name );

            $children_array = array();
                if ( ! empty( $menu_items ) ) {
                    foreach ( $menu_items as $item ) {
                    $children_array[ $item->ID ] = (array) $item;
                }
            }

            if ( ! empty( $menu_items ) ) {
                foreach ( $menu_items as $item ) {
                    if ( isset( $children_array[ $item->menu_item_parent ] ) ) {
                        if ( ! isset( $children_array[ $item->menu_item_parent ]['children'] ) ) {
                            $children_array[ $item->menu_item_parent ]['children'] = array();
                        }

                        $children_array[ $item->menu_item_parent ]['children'][] = $item->ID;
                    }
                }
            }

            if ( ! empty( $menu_items ) ) {
                foreach ( $menu_items as $item ) {
                    $converted_item = postlight_headless_wp_nav_menu_item( $item );

                    if ( isset( $children_array[ $item->ID ]['children'] ) ) {
                        $converted_item['children']    = $children_array[ $item->ID ]['children'];
                        $converted_item['hasChildren'] = true;
                    } else {
                        $converted_item['hasChildren'] = false;
                    }

                    $resolve[ $counter ] = $converted_item;

                    $counter++;
                }
            }
        }
    }

    return $resolve;
}

/**
 * Convert an array of WP Nav Menu Items into a resolve array
 */
function postlight_headless_wp_nav_menu_item( $item ) {
    $resolve = array(
        'label' => html_entity_decode( $item->title ),
    );

    $slug = $item->url;

    if ( false !== stripos( $slug, '/' ) ) {
        $slug = rtrim( str_replace( trailingslashit( get_site_url() ), '', $slug ), '/' );
    }

    switch ( $item->object ) {
        case 'post':
            $resolve['url'] = '/blog/' . $slug;
            break;
        case 'category':
            $resolve['url'] = '/category/' . $slug;
            break;
        case 'page':
            $resolve['url'] = '/' . $slug;
            break;
        case 'custom':
            $resolve['url'] = str_replace(
                array(
                    get_frontend_origin(),
                    get_site_url(),
                ),
                '/',
                $item->url
            );
            break;
        default:
            break;
    }

    $resolve['type'] = $item->object;

    $resolve['children'] = array();
    $resolve['itemID']   = $item->ID;

    if ( ! empty( $item->menu_item_parent ) && $item->menu_item_parent > 0 ) {
        $resolve['parent'] = $item->menu_item_parent;
    } else {
        $resolve['parent'] = 0;
    }

    if ( empty( $resolve['url'] ) ) {
        $resolve['url'] = '#';
    }

    return $resolve;
}

add_action(
    'graphql_register_types',
    function () {
        register_graphql_field(
            'RootQuery',
            'nestedMenu',
            array(
                'type'        => array( 'list_of' => 'NestedMenuType' ),
                'args'        => array(
                    'name' => array(
                        'type' => 'String',
                    ),
                ),
                'description' => __( 'Returns menu items', 'postlight-headless-wp' ),
                'resolve'     => function ( $source, $args = null ) {
                    return postlight_headless_wp_get_menu( ! empty( $args['name'] ) ? $args['name'] : null );
                },
            )
        );
    }
);

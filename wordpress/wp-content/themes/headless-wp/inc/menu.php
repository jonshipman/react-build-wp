<?php

/**
 * Update the menu items to remove the site_url so NavLink will work with Router.
 */
add_filter(
    'wp_setup_nav_menu_item',
    function( $menu_item ) {
        $menu_item->url = str_replace( get_site_url(), '',  $menu_item->url );

        return $menu_item;
    }
);

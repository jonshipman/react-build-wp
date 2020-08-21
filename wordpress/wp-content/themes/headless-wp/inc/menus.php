<?php
/**
 * Register main menu.
 *
 * @package  Headless_WP
 */

/**
 * Register navigation menu.
 *
 * @return void
 */
function register_menus() {
	register_nav_menu( 'header-menu', __( 'Header Menu', 'headless-wp' ) );
	register_nav_menu( 'footer-menu', __( 'Footer Menu', 'headless-wp' ) );
}
add_action( 'after_setup_theme', 'register_menus' );

/**
 * Update the menu items to remove the site_url so NavLink will work with Router.
 */
add_filter(
	'wp_setup_nav_menu_item',
	function( $menu_item ) {
		$menu_item->url = str_replace( get_site_url(), '', $menu_item->url );

		return $menu_item;
	}
);

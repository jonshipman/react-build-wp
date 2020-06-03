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

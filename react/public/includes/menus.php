<?php
/**
 * Register main menu.
 *
 * @package  React Build
 */

/**
 * Register navigation menu.
 *
 * @return void
 */
function rbld_register_menus() {
	register_nav_menu( 'header-menu', __( 'Header Menu', 'react-build' ) );
	register_nav_menu( 'footer-menu', __( 'Footer Menu', 'react-build' ) );
}

add_action( 'after_setup_theme', 'rbld_register_menus' );

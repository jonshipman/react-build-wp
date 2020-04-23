<?php
/**
 * Register main menu.
 *
 * @package  Postlight_Headless_WP
 */

/**
 * Register navigation menu.
 *
 * @return void
 */
function fix_for_wpb_on_render() {
    if ( class_exists( 'WPBMap' ) ) {
        WPBMap::addAllMappedShortcodes();
    }
}
add_action( 'graphql_register_types', 'fix_for_wpb_on_render', 1 );

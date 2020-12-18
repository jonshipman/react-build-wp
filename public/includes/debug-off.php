<?php
/**
 * Debugging off actions.
 *
 * @package React Build
 */

/**
 * Hide the ACF menu when not debugging.
 *
 * @param bool $bool Is admin hidden.
 * @return bool
 */
function rbld_hide_acf_menu( $bool ) {
	if ( defined( 'WP_DEBUG' ) && ( WP_DEBUG || WP_DEBUG === 'true' ) ) {
		return true;
	}

	return false;
}

add_filter( 'acf/settings/show_admin', 'rbld_hide_acf_menu', PHP_INT_MAX );

// Hide CPTUI menu.
if ( defined( 'WP_DEBUG' ) && ( ! WP_DEBUG || WP_DEBUG === 'false' ) ) {
	remove_action( 'admin_menu', 'cptui_plugin_menu' );
}

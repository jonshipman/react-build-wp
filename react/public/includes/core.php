<?php
/**
 * Core functions
 *
 * @package React Build
 * @since 1.0.0
 */

/**
 * WP-GraphQL Endpoint.
 *
 * @return string
 */
function rbld_get_gql_endpoint() {
	$filtered_endpoint = apply_filters( 'graphql_endpoint', null );
	$endpoint          = $filtered_endpoint ? $filtered_endpoint : get_graphql_setting( 'graphql_endpoint', 'graphql' );

	return home_url( $endpoint );
}

/**
 * Returns the contents of index.html as output by react-scripts build.
 *
 * @return string
 */
function rbld_get_build() {
	global $wp_filesystem;

	if ( ! is_a( $wp_filesystem, 'WP_Filesystem_Base' ) ) {
		include_once ABSPATH . 'wp-admin/includes/file.php';
		$creds = request_filesystem_credentials( site_url() );
		wp_filesystem( $creds );
	}

	$path = get_stylesheet_directory() . DIRECTORY_SEPARATOR . 'index.html';

	$output = $wp_filesystem->get_contents( $path );

	$output = str_replace(
		array( '<html><head>', '</head><body>', '</body></html>' ),
		array( '', '', '' ),
		$output
	);

	$wordpress_window_object = wp_json_encode( apply_filters( 'rbld_wp_js_window', array() ) );

	$output = sprintf( '<script type="text/javascript">window.__WP=%s;</script>', $wordpress_window_object ) . $output;
	return $output;
}

/**
 * Filters the __WP window object.
 *
 * @param array $wp Associative array being filtered.
 * @return array
 */
function rbld_js_window_filter( $wp ) {
	$wp['GQLURL']    = rbld_get_gql_endpoint();
	$wp['THEME_URL'] = get_stylesheet_directory_uri();
	return $wp;
}

add_filter( 'rbld_wp_js_window', 'rbld_js_window_filter' );

/**
 * Remove all scripts.
 *
 * @return void
 */
function rbld_remove_all_scripts() {
	if ( ! is_admin() ) {
		global $wp_scripts;
		$wp_scripts->queue = array();
	}
}

add_action( 'wp_print_scripts', 'rbld_remove_all_scripts', PHP_INT_MAX );

/**
 * Remove all styles.
 *
 * @return void
 */
function rbld_remove_all_styles() {
	if ( ! is_admin() ) {
		global $wp_styles;
		$wp_styles->queue = array();
	}
}

add_action( 'wp_print_styles', 'rbld_remove_all_styles', PHP_INT_MAX );

/**
 * Removes the wp-embed script.
 *
 * @return void
 */
function rbld_deregister_scripts() {
	wp_dequeue_script( 'wp-embed' );
}

add_action( 'wp_footer', 'rbld_deregister_scripts' );

// Remove Emoji styles and scripts.
remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
remove_action( 'wp_print_styles', 'print_emoji_styles' );
remove_action( 'admin_print_scripts', 'print_emoji_detection_script' );
remove_action( 'admin_print_styles', 'print_emoji_styles' );

// Prevents unwarranted redirects.
remove_action( 'template_redirect', 'redirect_canonical' );
remove_action( 'template_redirect', 'wp_redirect_admin_locations', 1000 );

// Prevent the adminbar from showing up.
add_filter( 'show_admin_bar', '__return_false', PHP_INT_MAX );

/**
 * Removes 404 for builtin pages.
 *
 * @return void
 */
function rbld_template_redirect() {
	global $wp_query;
	$current_uri    = trim( wp_parse_url( add_query_arg( array() ), PHP_URL_PATH ), '/' );
	$built_in_pages = array( 'search', 'login', 'forgot-password', 'logout', 'register' );

	if ( ! empty( $current_uri ) && ( in_array( $current_uri, $built_in_pages, true ) || false !== strpos( $current_uri, 'rp/' ) ) ) {
		$wp_query->is_404 = false;
		status_header( 200 );
	}
}

add_action( 'template_redirect', 'rbld_template_redirect', PHP_INT_MAX );

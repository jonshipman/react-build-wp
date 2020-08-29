<?php
/**
 * Theme for the Headless WordPress Starter Kit.
 *
 * Read more about this project at:
 * https://github.com/jonshipman/headless-wp-starter
 *
 * Originally forked from the fine folks from https://github.com/postlight/headless-wp-starter
 *
 * @package  Headless_WP
 */

// Frontend origin.
require_once 'inc/frontend-origin.php';

// ACF commands.
require_once 'inc/class-acf-commands.php';

// Logging functions.
require_once 'inc/log.php';

// CORS handling.
require_once 'inc/headers.php';

// Admin modifications.
require_once 'inc/admin.php';

// Menu hooks and actions.
require_once 'inc/menus.php';

// Add Headless Settings area.
require_once 'inc/acf-options.php';

// Add GraphQL resolvers.
require_once 'inc/graphql/resolvers.php';

// Add GraphQL mutations.
require_once 'inc/graphql/mutations.php';

// Prevent double HTML entity wrapping.
require_once 'inc/html-entities.php';

// Adds a settings page for options.
require_once 'inc/settings.php';

// The redirect for the frontpage to go to json.
require_once 'inc/redirect.php';

// Form actions that trigger on a successful submittion.
require_once 'inc/form-actions.php';

// Increases the maximum post count for sitemaps.
require_once 'inc/increase-max-post-limit.php';

// Add frontend url to the edit-post backend point.
require_once 'inc/add-frontend-url-in-admin.php';

// Authentication secret.
require_once 'inc/jwt.php';

// If WPBakery is installed, trigger the shortcode execution.
require_once 'inc/wpb.php';

// Adds thumbnails.
add_action(
	'after_setup_theme',
	function () {
		add_theme_support( 'post-thumbnails' );
	}
);

// Modifies links in the content to point to the origin.
add_filter(
	'the_content',
	function ( $content ) {
		$content = str_replace( array( 'href="' . get_site_url() ), sprintf( 'href="%s', get_frontend_origin() ), $content );
		$content = str_replace( 'src="/wp-content', 'src="' . get_site_url() . '/wp-content', $content );

		// Fix links to the images.
		$content = str_replace( sprintf( 'href="%s/wp-content/', get_frontend_origin() ), sprintf( 'href="%s/wp-content/', get_site_url() ), $content );

		return $content;
	},
	PHP_INT_MAX
);

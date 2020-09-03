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

 // Filter to change origin.
add_filter(
	'frontend_origin',
	function() {
		return 'http://localhost/';
	}
);

// Filter to change local settings.
add_filter(
	'headless_wp_settings',
	function( $settings ) {
		$theme_settings = array(
			'company_info' => array(
				'label'  => __( 'Company Info', 'headless-wp' ),
				'fields' => array(
					'phone_number'  => array(
						'label' => __( 'Phone Number', 'headless-wp' ),
						'args'  => array(
							'type'              => 'string',
							'sanitize_callback' => 'sanitize_text_field',
							'show_in_graphql'   => true,
						),
					),
					'contact_email' => array(
						'label' => __( 'Contact Email', 'headless-wp' ),
						'args'  => array(
							'type'              => 'string',
							'sanitize_callback' => 'sanitize_text_field',
							'show_in_graphql'   => true,
						),
					),
				),
			),
		);

		return array_merge(
			$theme_settings,
			$settings
		);
	}
);

// Frontend origin.
require_once 'inc/frontend-origin.php';

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
require_once 'inc/content-nodes.php';

// Prevent double HTML entity wrapping.
require_once 'inc/html-entities.php';

// Adds a settings page for options.
require_once 'inc/settings.php';

// The redirect for the frontpage to go to json.
require_once 'inc/redirect.php';

// Increases the maximum post count for sitemaps.
require_once 'inc/increase-max-post-limit.php';

// Add frontend url to the edit-post backend point.
require_once 'inc/add-frontend-url-in-admin.php';

// Authentication secret.
require_once 'inc/jwt.php';

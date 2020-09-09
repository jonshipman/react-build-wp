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
		return 'http://localhost:3000';
	}
);

function headless_wp_settings_label() {
	return __('Headless Settings', 'headless-wp' );
}

add_filter( 'wp_boilerplate_nodes_settings_page_label', 'headless_wp_settings_label' );
add_filter( 'wp_boilerplate_nodes_settings_menu_label', 'headless_wp_settings_label' );

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

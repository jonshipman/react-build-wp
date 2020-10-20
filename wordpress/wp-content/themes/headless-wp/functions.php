<?php
/**
 * Theme for the Headless WordPress Starter Kit.
 *
 * Local configuration hooks.
 *
 * @package  Headless_WP
 */

/**
 * Filter to change the origin.
 *
 * @return string
 */
function hewp_frontend_origin() {
	return 'http://localhost:3000';
}

add_filter( 'frontend_origin', 'hewp_frontend_origin' );

/**
 * Changes the settings label in WP Admin.
 *
 * @return string
 */
function hewp_settings_label() {
	return __( 'Headless WordPress', 'headless-wp' );
}

add_filter( 'wp_boilerplate_nodes_settings_page_label', 'hewp_settings_label' );
add_filter( 'wp_boilerplate_nodes_settings_menu_label', 'hewp_settings_label' );

/**
 * Adds theme specific settings to WP Admin.
 *
 * @param array $settings Settings to filter.
 * @return array
 */
function hewp_settings_array( $settings ) {
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
		$settings,
		$theme_settings
	);
}

add_filter( 'wp_boilerplate_nodes_settings', 'hewp_settings_array' );

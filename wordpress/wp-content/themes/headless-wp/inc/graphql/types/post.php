<?php
/**
 * Types for post.
 *
 * @package Headless_WP
 */

add_action(
	'graphql_register_types',
	function () {
		if ( class_exists( 'WPBMap' ) ) {
			register_graphql_object_type(
				'TotalFields',
				array(
					'description' => __( 'Total Post Meta fields', 'headless-wp' ),
					'fields'      => array(
						'titleBackground'         => array(
							'type'        => 'String',
							'description' => __( 'Total page title background', 'headless-wp' ),
						),
						'titleBackgroundPosition' => array(
							'type'        => 'String',
							'description' => __( 'Total page title background position', 'headless-wp' ),
						),
						'titleBackgroundOverlay'  => array(
							'type'        => 'String',
							'description' => __( 'Total page title background overlay', 'headless-wp' ),
						),
						'titleDisabled'           => array(
							'type'        => 'Boolean',
							'description' => __( 'Total page title - Is it disabled?', 'headless-wp' ),
						),
						'subTitle'                => array(
							'type'        => 'String',
							'description' => __( 'Total page subtitle', 'headless-wp' ),
						),
						'titleHeight'             => array(
							'type'        => 'String',
							'description' => __( 'Total page title height', 'headless-wp' ),
						),
					),
				)
			);
		}
	}
);

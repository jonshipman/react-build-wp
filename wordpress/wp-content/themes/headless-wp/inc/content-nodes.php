<?php
/**
 * Adds extra meta to content nodes.
 *
 * @package Headless_WP
 */

// Adds thumbnails.
add_action(
	'after_setup_theme',
	function () {
		add_theme_support( 'post-thumbnails' );
	}
);

add_action(
	'graphql_register_types',
	function () {
		add_filter(
			'acf_wpgraphql_locations',
			function ( $locations ) {
				$locations[] = array(
					'operator' => '==',
					'param'    => 'page_type',
					'value'    => 'front_page',
					'field'    => 'Page',
				);

				return $locations;
			}
		);

		$name   = 'dateFormatted';
		$config = array(
			'type'        => 'String',
			'description' => __( 'Returns the date as formatted in WordPress', 'headless-wp' ),
			'resolve'     => function ( $post ) {
				return get_the_date( get_option( 'date_format' ), $post->ID );
			},
		);

		register_graphql_field( 'ContentNode', $name, $config );

		$name   = 'pageTemplate';
		$config = array(
			'type'        => 'String',
			'description' => __( 'WordPress Page Template', 'headless-wp' ),
			'resolve'     => function ( $post ) {
				return get_page_template_slug( $post->ID );
			},
		);

		register_graphql_field( 'Page', $name, $config );
	}
);

// Fixes missing single name on the menuItem.
add_filter(
	'register_post_type_args',
	function( $args, $post_type ) {
		if ( 'nav_menu_item' === $post_type ) {
			$args['graphql_single_name'] = 'menuItem';
		}

		return $args;
	},
	10,
	2
);

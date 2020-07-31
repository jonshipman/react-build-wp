<?php
/**
 * Adds extra meta to content nodes.
 *
 * @package Headless_WP
 */

use \WPGraphQL\Data\DataSource;

require_once __DIR__ . '/../types/content-node.php';

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

		if ( class_exists( 'WPBMap' ) ) {
			$name   = 'wpbCustomCss';
			$config = array(
				'type'        => 'String',
				'description' => __( 'Returns the custom wpb styles attached to post', 'shamrock-roofer' ),
				'resolve'     => function ( $post ) {
					$post_css = get_post_meta( $post->ID, '_wpb_post_custom_css', true );
					$shortcode_css = get_post_meta( $post->ID, '_wpb_shortcodes_custom_css', true );

					if ( empty( $post_css ) && empty( $shortcode_css ) ) {
						return null;
					}

					return $post_css . "\n" . $shortcode_css;
				},
			);

			register_graphql_field( 'ContentNode', $name, $config );

			register_graphql_field(
				'ContentNode',
				'totalMeta',
				array(
					'type'        => 'TotalFields',
					'description' => 'Total Post Meta fields',
					'resolve'     => function( $post ) {
						$r = array(
							'titleBackground'         => null,
							'titleBackgroundPosition' => get_post_meta( $post->ID, 'wpex_post_title_background_position', true ) ?: null,
							'subTitle'                => get_post_meta( $post->ID, 'wpex_post_subheading', true ) ?: null,
							'titleHeight'             => get_post_meta( $post->ID, 'wpex_post_title_height', true ) ?: null,
							'titleBackgroundOverlay'  => get_post_meta( $post->ID, 'wpex_post_title_background_overlay', true ) ?: null,
							'titleDisabled'           => get_post_meta( $post->ID, 'wpex_disable_title', true ) === 'on',
						);

						$id = get_post_meta( $post->ID, 'wpex_post_title_background_redux', true );
						if ( $id && 'background-image' === get_post_meta( $post->ID, 'wpex_post_title_style', true ) ) {
							$src = wp_get_attachment_image_src( $id, 'full' );
							if ( $src ) {
								$r['titleBackground'] = $src[0];
							}
						}

						return $r;
					},
				)
			);
		}
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

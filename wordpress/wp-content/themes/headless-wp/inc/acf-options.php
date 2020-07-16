<?php
/**
 * Add ACF options page.
 *
 * @package  Headless_WP
 */

// Add a custom options page to associate ACF fields.
if ( function_exists( 'acf_add_options_page' ) ) {
	acf_add_options_page(
		array(
			'page_title' => 'Headless Settings',
			'menu_title' => 'Headless',
			'menu_slug'  => 'headless-settings',
			'capability' => 'manage_options',
			'post_id'    => 'headless-settings',
			'redirect'   => false,
		)
	);
}

/**
 * This function will add acf fields to the post or page when added to the theme.
 * Format:
 *  add_filter(
 *      'acf_wpgraphql_locations',
 *      function( $locations ) {
 *          $locations[] = array(
 *          'operator' => '==',
 *          'param' => 'page_template',
 *          'value' => 'templates/landing-page.php',
 *          'field' => 'Page',
 *          );
 *
 *          return $locations;
 *      }
 *  );
 */
if ( class_exists( 'WPGraphQL\Registry\TypeRegistry' ) ) {
	add_action(
		'graphql_register_types',
		function ( \WPGraphQL\Registry\TypeRegistry $type_registry ) {
			if ( function_exists( 'acf_get_field_groups' ) && class_exists( '\WPGraphQL\ACF\Config' ) ) {
				$acf_fields = apply_filters( 'acf_wpgraphql_locations', array() );

				if ( ! empty( $acf_fields ) ) {
					foreach ( $acf_fields as $acf_field ) {
						$operator = $acf_field['operator'];
						$param    = $acf_field['param'];
						$value    = $acf_field['value'];
						$__field  = isset( $acf_field['field'] ) ? $acf_field['field'] : '';

						if ( empty( $__field ) ) {
							if ( false !== strpos( $param, 'page' ) ) {
								$__field = 'Page';
							}

							if ( false !== strpos( $param, 'post' ) ) {
								$__field = 'Post';
							}
						}

						$ConfigClass       = new \WPGraphQL\ACF\Config();
						$field_groups      = acf_get_field_groups();
						$post_field_groups = array();

						foreach ( $field_groups as $field_group ) {
							if ( ! empty( $field_group['location'] ) && is_array( $field_group['location'] ) ) {
								foreach ( $field_group['location'] as $locations ) {
									if ( ! empty( $locations ) && is_array( $locations ) ) {
										foreach ( $locations as $location ) {
											if ( '!=' === $location['operator'] ) {
												continue;
											}

											if ( $operator === $location['operator'] && $param === $location['param'] && $value === $location['value'] ) {
												$post_field_groups[] = $field_group;
											}
										}
									}
								}
							}
						}

						/**
						 * If no field groups are assigned to a specific post, we don't need to modify the Schema
						 */
						if ( empty( $post_field_groups ) ) {
							continue;
						}

						foreach ( $post_field_groups as $field_group ) {
							$field_name = isset( $field_group['graphql_field_name'] ) ? $field_group['graphql_field_name'] : $field_group['title'];
							$field_name = \WPGraphQL\ACF\Config::camel_case( $field_name );

							$field_group['type'] = 'group';
							$field_group['name'] = $field_name;
							$description         = ! empty( $field_group['description'] ) ? $field_group['description'] : '';
							$config              = array(
								'name'            => $field_name,
								'description'     => $description,
								'acf_field'       => $field_group,
								'acf_field_group' => null,
								'resolve'         => function ( $root ) use ( $field_group ) {
									return isset( $root ) ? $root : null;
								},
							);

							// Using a binding closure until this gets an API.
							$closure = function () use ( $field_name, $config, $type_registry, $__field ) {
								$this->type_registry = $type_registry;
								$this->register_graphql_field( $__field, $field_name, $config );
							};

							$binding = $closure->bindTo( $ConfigClass, 'WPGraphQL\ACF\Config' );
							$binding();
						}
					}
				}
			}
		},
		25
	);
}

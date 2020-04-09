<?php
/**
 * Front Page GraphQL resolver.
 *
 * @package Postlight_Headless_WP
 */

use \WPGraphQL\Data\DataSource;
use \GraphQL\Error\UserError;
use \WPGraphQL\Registry\TypeRegistry;

add_action(
    'graphql_register_types',
    function ( TypeRegistry $type_registry ) {
        register_graphql_field(
            'RootQuery',
            'frontPage',
            array(
                'type'        => 'Post',
                'description' => __( 'Returns homepage', 'postlight-headless-wp' ),
                'resolve'     => function ( $root, $args, $context, $info ) {
                    $page_on_front_id = (int) get_option( 'page_on_front' );

                    if ( ! empty( $page_on_front_id ) ) {
                        return DataSource::resolve_post_object( $page_on_front_id, $context );
                    } else {
                        throw new UserError( 'No frontpage' );
                    }
                },
            )
        );

        if ( function_exists( 'acf_get_field_groups' ) && class_exists( '\WPGraphQL\ACF\Config' ) ) {
            $Config            = new \WPGraphQL\ACF\Config();
            $field_groups      = acf_get_field_groups();
            $post_field_groups = null;

            foreach ( $field_groups as $field_group ) {
                if ( ! empty( $field_group['location'] ) && is_array( $field_group['location'] ) ) {
                    foreach ( $field_group['location'] as $locations ) {
                        if ( ! empty( $locations ) && is_array( $locations ) ) {
                            foreach ( $locations as $location ) {
                                if ( '!=' === $location['operator'] ) {
                                      continue;
                                }

                                if ( '==' === $location['operator'] && 'page_type' === $location['param'] && 'front_page' === $location['value'] ) {
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
                return;
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
                $closure = function () use ( $field_name, $config, $type_registry ) {
                    $this->type_registry = $type_registry;
                    $this->register_graphql_field( 'Post', $field_name, $config );
                };

                $binding = $closure->bindTo( $Config, 'WPGraphQL\ACF\Config' );
                $binding();
            }
        }
    }
);

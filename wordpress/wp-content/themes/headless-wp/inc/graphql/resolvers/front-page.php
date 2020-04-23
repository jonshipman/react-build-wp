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

        add_filter(
            'acf_wpgraphql_locations',
            function ( $locations ) {
                $locations[] = array(
                    'operator' => '==',
                    'param'    => 'page_type',
                    'value'    => 'front_page',
                    'field'    => 'Post',
                );

                return $locations;
            }
        );
    }
);

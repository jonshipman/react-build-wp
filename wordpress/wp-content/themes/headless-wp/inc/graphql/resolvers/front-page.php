<?php
/**
 * Front Page GraphQL resolver.
 *
 * @package Headless_WP
 */

use \WPGraphQL\Data\DataSource;

add_action(
    'graphql_register_types',
    function () {
        register_graphql_field(
            'RootQuery',
            'frontPage',
            array(
                'type'        => 'Post',
                'description' => __( 'Returns homepage', 'headless-wp' ),
                'resolve'     => function ( $root, $args, $context, $info ) {
                    $page_on_front_id = (int) get_option( 'page_on_front' );
                    return DataSource::resolve_post_object( $page_on_front_id, $context );
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

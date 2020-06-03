<?php
/**
 * Adds extra meta to the post.
 *
 * @package Headless_WP
 */

add_action(
    'graphql_register_types',
    function () {
        $name   = 'dateFormatted';
        $config = array(
            'type'        => 'String',
            'description' => __( 'Returns the date as formatted in WordPress', 'headless-wp' ),
            'resolve'     => function ( $post ) {
                return get_the_date( get_option( 'date_format' ), $post->ID );
            },
        );

        register_graphql_field( 'Page', $name, $config );
        register_graphql_field( 'Post', $name, $config );

        register_graphql_field(
            'Page',
            'pageTemplate',
            array(
                'type'        => 'String',
                'description' => 'WordPress Page Template',
                'resolve'     => function ( $post ) {
                    return get_page_template_slug( $post->ID );
                },
            )
        );
    }
);

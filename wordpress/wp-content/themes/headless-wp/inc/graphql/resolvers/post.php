<?php
/**
 * Adds extra meta to the post.
 *
 * @package Headless_WP
 */

use \WPGraphQL\Data\DataSource;

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

        $name   = 'pageTemplate';
        $config = array(
            'type'        => 'String',
            'description' => 'WordPress Page Template',
            'resolve'     => function ( $post ) {
                if ( 'page' === get_post_type( $post->ID ) ) {
                    return get_page_template_slug( $post->ID );
                }

                return null;
            },
        );

        register_graphql_field( 'Page', $name, $config );
        register_graphql_field( 'Post', $name, $config );

        $name   = 'postType';
        $config = array(
            'type'        => 'String',
            'description' => 'The post type (useful for getPostOrPageByUri)',
            'resolve'     => function ( $post ) {
                return get_post_type( $post->ID );;
            },
        );

        register_graphql_field( 'Page', $name, $config );
        register_graphql_field( 'Post', $name, $config );
    }
);

function headless_wp_arg_process( $args ) {
    if ( isset( $args['uri'] ) ) {
        $uri = $args['uri'];
        return url_to_postid( trailingslashit( get_site_url() ) . ltrim( $uri, '/' ) );
    }

    return 0;
}

/**
 * Get the Post or Page object by URI (permalink safe).
 */
add_action(
    'graphql_register_types',
    function () {
        register_graphql_field(
            'RootQuery',
            'getPostOrPageByUri',
            array(
                'type'        => 'Post',
                'args'        => array(
                    'uri' => array(
                        'type'        => 'String',
                        'description' => __( 'The uri of the post or page to look for.', 'headless-wp' ),
                    ),
                ),
                'description' => __( 'Gets the post or page from given uri.e', 'headless-wp' ),
                'resolve'     => function ( $root, $args, $context, $info ) {
                    $post_id = headless_wp_arg_process( $args );
                    return DataSource::resolve_post_object( $post_id, $context );
                },
            )
        );
    }
);
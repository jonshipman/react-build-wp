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
        }
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
                'type'        => 'ContentNode',
                'args'        => array(
                    'uri' => array(
                        'type'        => 'String',
                        'description' => __( 'The uri of the post or page to look for', 'headless-wp' ),
                    ),
                ),
                'description' => __( 'Gets the post or page from given uri', 'headless-wp' ),
                'resolve'     => function ( $root, $args, $context, $info ) {
                    $post_id = headless_wp_arg_process( $args );

                    return DataSource::resolve_post_object( $post_id, $context );
                },
            )
        );
    }
);
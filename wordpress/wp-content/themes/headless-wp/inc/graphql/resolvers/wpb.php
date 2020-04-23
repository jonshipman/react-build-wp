<?php
/**
 * Adds required WPBakery postmeta to the GraphQL.
 *
 * @package Postlight_Headless_WP
 */

use \WPGraphQL\Model\Post;

add_action(
    'graphql_register_types',
    function () {
        if ( defined( 'WPB_VC_VERSION' ) ) {
            $name   = 'wpbCustomCss';
            $config = array(
                'type'        => 'String',
                'description' => __( 'Returns the custom wpb styles attached to post', 'postlight-headless-wp' ),
                'resolve'     => function ( Post $post ) {
                    return ( get_post_meta( $post->ID, '_wpb_shortcodes_custom_css', true ) ) ? get_post_meta( $post->ID, '_wpb_shortcodes_custom_css', true ) : null;
                },
            );

            register_graphql_field( 'Page', $name, $config );
            register_graphql_field( 'Post', $name, $config );
        }
    }
);

<?php
/**
 * Adds added settings to the GraphQL.
 *
 * @package Postlight_Headless_WP
 */

require_once __DIR__ . '/../types/class-settingstype.php';

use \WPGraphQL\Model\Post;

add_action(
    'graphql_register_types',
    function () {
        register_graphql_field(
            'RootQuery',
            'headlessSettings',
            array(
                'type'        => 'HeadlessWpSettingsType',
                'description' => __( 'Support for additional theme settings', 'postlight-headless-wp' ),
                'resolve'     => function ( $source ) {
                    return array(
                        'googleSiteKey' => get_option( 'headless_wp_google_site_key' ),
                    );
                },
            )
        );
    }
);

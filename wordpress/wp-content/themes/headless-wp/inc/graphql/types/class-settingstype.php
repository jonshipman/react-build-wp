<?php
/**
 * Retrieves any settings we have added in the backend.
 *
 * @package Postlight_Headless_WP
 */

add_action(
    'graphql_register_types',
    function () {
        register_graphql_object_type(
            'HeadlessWpSettingsType',
            array(
                'description' => __( 'Support for additional theme settings', 'postlight-headless-wp' ),
                'fields'      => array(
                    'googleSiteKey'  => array(
                        'type'        => 'String',
                        'description' => __( 'Recaptcha Site Key', 'postlight-headless-wp' ),
                    ),
                ),
            )
        );
    }
);

<?php
/**
 * Form GraphQL type.
 *
 * @package Postlight_Headless_WP
 */

add_action(
    'graphql_register_types',
    function() {
		register_graphql_object_type(
            'WpNonce',
            array(
                'description' => __( 'Nonces for the forms', 'postlight-headless-wp' ),
                'fields'      => array(
                    'form'    => array(
                        'type'        => 'String',
                        'description' => __( 'Form attached to nonce', 'postlight-headless-wp' ),
                    ),
                    'wpNonce' => array(
                        'type'        => 'String',
                        'description' => __( 'Nonce value', 'postlight-headless-wp' ),
                    ),
                ),
            )
        );

        register_graphql_object_type(
            'FormType',
            array(
                'description' => __( 'Support for the form actions over GraphQL', 'postlight-headless-wp' ),
                'fields'      => array(
                    'wpNonce'         => array(
                        'type'        => array( 'list_of' => 'WpNonce' ),
                        'description' => __( 'Current nonce for session', 'postlight-headless-wp' ),
                    ),
                    'recatchaSiteKey' => array(
                        'type'        => 'String',
                        'description' => __( 'Recaptcha Site Key', 'postlight-headless-wp' ),
                    ),
                ),
            )
        );
	}
);

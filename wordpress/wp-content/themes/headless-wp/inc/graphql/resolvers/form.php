<?php
/**
 * Form GraphQL resolver.
 *
 * @package Headless_WP
 */

 use \WPGraphQL\Registry\TypeRegistry;

require_once __DIR__ . '/../types/form.php';

add_action(
    'graphql_register_types',
    function ( TypeRegistry $type_registry ) {
        register_graphql_field(
            'RootQuery',
            'formData',
            array(
                'type'        => 'FormType',
                'description' => __( 'Handles form pre-population data', 'headless-wp' ),
                'resolve'     => function ( $source ) {
                    $res = array(
                        'wpNonce'         => array(),
                        'recatchaSiteKey' => get_option( 'google_site_key' ) ?: '',
                    );

                    foreach ( apply_filters( 'headless_wp_form_nonce_actions', array() ) as $form => $action ) {
                        $res['wpNonce'][] = array(
                            'form' => $form,
                            'wpNonce' => wp_create_nonce( $action ),
                        );
                    }

                    return $res;
                },
            )
        );
    }
);

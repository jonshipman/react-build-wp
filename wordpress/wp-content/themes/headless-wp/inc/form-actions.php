<?php
/**
 * Form success filters.
 *
 * @package  Postlight_Headless_WP
 */

/**
 * These should mirror the forms in $react/components/forms.
 * Add the nonce actions to this filter.
 */
add_filter(
    'headless_wp_form_nonce_actions',
    function( $forms ) {
        $forms['default'] = 'default-contact-form';

        return $forms;
    }
);

/**
 * ... and append to this array for the fields...
 */
add_filter(
    'headless_wp_form_nonce_fields',
    function( $fields ) {
        $fields['default'] = array(
            'yourName'     => array(
                'type'        => 'String',
                'description' => __( 'Form submitter\'s name', 'postlight-headless-wp' ),
            ),
            'email'         => array(
                'type'        => 'String',
                'description' => __( 'Form submitter\'s email', 'postlight-headless-wp' ),
            ),
            'phone'         => array(
                'type'        => 'String',
                'description' => __( 'Form submitter\'s phone', 'postlight-headless-wp' ),
            ),
            'message'         => array(
                'type'        => 'String',
                'description' => __( 'Form submitter\'s message', 'postlight-headless-wp' ),
            ),
        );

        return $fields;
    }
);

/**
 * ...and another filter 'headless_wp_form_success_%FORMNAME%'
 * to handle your success. You can take this function and
 * reuse it.
 */
add_filter(
    'headless_wp_form_success_default',
    function( $success, $input ) {
        array_walk(
            $input,
            function( &$value, $key  ) {
                $value = sprintf( "%s: %s\n", ucwords( $key ), $value );
            }
        );

        if ( $success ) {
            $success = wp_mail(
                get_options( 'admin_email' ),
                'Form Email',
                implode( "\n", $input )
            );
        }

        return $success;
    },
    10,
    2
);

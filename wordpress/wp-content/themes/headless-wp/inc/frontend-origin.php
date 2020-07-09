<?php
/**
 * Frontend origin helper function.
 *
 * @package  Headless_WP
 */

/**
 * Placeholder function for determining the frontend origin.
 *
 * @return str Frontend origin URL, e.g. the React URL.
 */
function get_frontend_origin( $original_url = '' ) {
    $origin = 'http://localhost:3000';

    // If we're debugging, allow localhost.
    if (
        WP_DEBUG &&
        isset( $_SERVER['HTTP_REFERER'] ) &&
        false !== strpos( $_SERVER['HTTP_REFERER'], 'localhost:3000' )
    ) {
        $origin = 'http://localhost:3000';
    }

    if ( ! empty( $original_url ) ) {
        return str_replace( get_site_url(), $origin, $original_url );
    }

    return $origin;
}

add_filter(
    'allowed_http_origins',
    function( $origins ) {
        $origins = array_merge( array( get_frontend_origin() ), $origins );
        return $origins;
    },
    99
);

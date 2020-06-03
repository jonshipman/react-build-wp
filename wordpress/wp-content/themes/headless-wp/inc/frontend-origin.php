<?php
/**
 * Frontend origin helper function.
 *
 * @package  Headless_WP
 */

/**
 * Placeholder function for determining the frontend origin.
 *
 * @TODO Determine the headless client's URL based on the current environment.
 *
 * @return str Frontend origin URL, i.e., http://localhost:3000.
 */
function get_frontend_origin( $original_url = '' ) {
    $origin = 'http://localhost:3000';
    if ( ! empty( $original_url ) ) {
        return str_replace( get_site_url(), $origin, $original_url );
    }
    return $origin;
}

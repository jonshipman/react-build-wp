<?php
/**
 * WP-GRAPHQL HEADERS filter.
 *
 * @package  Headless_WP
 */

/**
 * IMPORTANT: Remember to set 'SetEnvIf Authorization "(.*)" HTTP_AUTHORIZATION=$1' in APACHE or equiv in nginx.
 */

add_filter(
    'graphql_response_headers_to_send',
    function( $headers ) {
        if ( isset( $headers['X-hacker'] ) ) {
            unset( $headers['X-hacker'] );
        }

        $headers['Access-Control-Allow-Origin'] = get_frontend_origin();
        $headers['Access-Control-Allow-Methods'] = 'GET, POST';
        $headers['Access-Control-Allow-Credentials'] = 'true';
        $headers['Access-Control-Expose-Headers'] = 'Content-Type, X-JWT-Auth, X-JWT-Refresh, HTTP_X_WP_NONCE';

        return $headers;
    }
);

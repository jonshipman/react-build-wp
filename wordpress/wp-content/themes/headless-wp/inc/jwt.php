<?php

// Recommended to set this to a unique key.
// See https://api.wordpress.org/secret-key/1.1/salt/.
add_filter( 'graphql_jwt_auth_secret_key', function() {
    return SECURE_AUTH_KEY;
});

// Set auth cookie for AJAX requests.
// Call with the JWT after login.
add_action(
	'template_redirect',
	function() {
		global $wp_query;
		$url_path = trim( parse_url( add_query_arg( array() ), PHP_URL_PATH ), '/' );

		if ( 0 === stripos( $url_path, 'cors/' ) ) {
			$parts = explode( '/', rtrim( $url_path, '/' ) );
			$token  = end( $parts );

			$token = WPGraphQL\JWT_Authentication\Auth::validate_token( $token );
			if ( ! empty( $token ) && ! is_wp_error( $token ) ) {
				$user = get_user_by( 'id', $token->data->user->id );

				if ( ! empty( $user ) && ! is_wp_error( $user ) ) {
					if ( is_user_logged_in() ) {
						$current_user = wp_get_current_user();

						if ( $current_user && $user->ID !== $current_user->ID ) {

							// Wrong user is logged in, clear the cookies.
							wp_logout();
						}

						if ( $current_user === $user->ID ) {

							// User is logged in and correct, return out of function.
							return;
						}
					}

					if ( ! is_user_logged_in() ) {

						// Login and set cookies.
						$secure_cookie = stripos( site_url(), 'https' ) === 0;
						wp_set_auth_cookie( $user->ID, true, $secure_cookie );
						do_action( 'wp_login', $user->user_login, $user );
					}
				}
			}
		}
	}
);

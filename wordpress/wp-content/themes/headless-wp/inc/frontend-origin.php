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
	$origin = apply_filters( 'frontend_origin', 'http://localhost:3000' );

	// If we're debugging, allow localhost.
	if (
		WP_DEBUG &&
		isset( $_SERVER['HTTP_REFERER'] ) &&
		false !== strpos( $_SERVER['HTTP_REFERER'], ':3000' )
	) {
		$origin = explode( ':3000', $_SERVER['HTTP_REFERER'] )[0] . ':3000';
	}

	if ( ! empty( $original_url ) ) {
		return str_replace( get_site_url(), $origin, $original_url );
	}

	return $origin;
}

// Fix breadcrumbs to use the frontend origin.
add_filter(
	'wpseo_breadcrumb_links',
	function( $links ) {
		foreach ( $links as &$link ) {
			$link['url'] = get_frontend_origin( $link['url'] );
		}

		return $links;
	}
);

// Adds origin to the http_origins list.
add_filter(
	'allowed_http_origins',
	function( $origins ) {
		$origins = array_merge( array( get_frontend_origin() ), $origins );
		return $origins;
	},
	99
);

// Sets the login url.
add_filter(
	'login_url',
	function() {
		return sprintf( '%s/login', get_frontend_origin() );
	}
);

// Sets the forgotpassword url.
add_filter(
	'lostpassword_url',
	function() {
		return sprintf( '%s/forgot-password', get_frontend_origin() );
	}
);

// Sets the registration url.
add_filter(
	'register_url',
	function() {
		return sprintf( '%s/register', get_frontend_origin() );
	}
);

// Filters the password reset email to change the retrieve password url.
add_filter(
	'retrieve_password_message',
	function( $message, $key, $user_login ) {
		$site_name = wp_specialchars_decode( get_option( 'blogname' ), ENT_QUOTES );

		$message = __( 'Someone has requested a password reset for the following account:' ) . "\r\n\r\n";
		/* translators: %s: Site name. */
		$message .= sprintf( __( 'Site Name: %s' ), $site_name ) . "\r\n\r\n";
		/* translators: %s: User login. */
		$message .= sprintf( __( 'Username: %s' ), $user_login ) . "\r\n\r\n";
		$message .= __( 'If this was a mistake, just ignore this email and nothing will happen.' ) . "\r\n\r\n";
		$message .= __( 'To reset your password, visit the following address:' ) . "\r\n\r\n";
		$message .= sprintf( '%s/rp/%s/%s', get_frontend_origin(), $key, rawurlencode( $user_login ) ) . "\r\n";

		return $message;
	},
	99,
	3
);

// Filters the user registration email for the same.
add_filter(
	'wp_new_user_notification_email',
	function( $wp_new_user_notification_email, $user ) {
		$key = get_password_reset_key( $user );

		$message  = sprintf( __( 'Username: %s' ), $user->user_login ) . "\r\n\r\n";
		$message .= __( 'To set your password, visit the following address:' ) . "\r\n\r\n";
		$message .= sprintf( '%s/rp/%s/%s', get_frontend_origin(), $key, rawurlencode( $user->user_login ) ) . "\r\n";

		$message .= wp_login_url() . "\r\n";

		$wp_new_user_notification_email['message'] = $message;

		return $wp_new_user_notification_email;
	},
	99,
	2
);

// Modifies links in the content to point to the origin.
add_filter(
	'the_content',
	function ( $content ) {
		$content = str_replace( array( 'href="' . get_site_url() ), sprintf( 'href="%s', get_frontend_origin() ), $content );
		$content = str_replace( 'src="/wp-content', 'src="' . get_site_url() . '/wp-content', $content );

		// Fix links to the images.
		$content = str_replace( sprintf( 'href="%s/wp-content/', get_frontend_origin() ), sprintf( 'href="%s/wp-content/', get_site_url() ), $content );

		return $content;
	},
	PHP_INT_MAX
);

<?php
/**
 * Handle the redirection on the frontend.
 *
 * @package  Headless_WP
 */

/**
 * Handles the redirection on the frontend to the wp-json api.
 *
 * @return void
 */
add_action(
	'template_redirect',
	function () {
		$rest_url    = wp_parse_url( rest_url() );
		$current_url = wp_parse_url( add_query_arg( array() ) );

		if ( 0 !== strpos( $current_url['path'], $rest_url['path'] ) ) {
			if ( is_singular() ) {
				if ( get_option( 'redirect_page_to_frontend_origin' ) ) {
					header(
						sprintf(
							'Location: %s',
							get_frontend_origin( get_permalink( get_post() ) )
						),
						true,
						301
					);

					die;
				}

				header(
					sprintf(
						'Location: %s/wp/v2/%s/%s',
						rtrim( rest_url(), '/' ),
						get_post_type_object( get_post_type() )->rest_base,
						get_post()->ID
					)
				);
			} else {
				if ( get_option( 'redirect_page_to_frontend_origin' ) ) {
					header(
						sprintf(
							'Location: %s',
							get_frontend_origin()
						),
						true,
						301
					);

					die;
				}

				header(
					sprintf(
						'Location: %s',
						rest_url()
					)
				);
			}
		}
	}
);

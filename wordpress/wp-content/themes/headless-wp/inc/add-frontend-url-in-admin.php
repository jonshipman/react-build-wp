<?php

/**
 * Adds editor-scripts to the admin.
 */
add_action(
	'admin_init',
	function() {
		if ( ! empty( $_GET['action'] ) ) {
			wp_register_script(
				'headless-wp/editor-scripts',
				sprintf( '%s%s', get_stylesheet_directory_uri(), '/assets/editor-scripts.js' ),
				array(
					'wp-plugins',
					'wp-edit-post',
					'wp-element',
				),
				filemtime( sprintf( '%s%s%s%s', trailingslashit( get_stylesheet_directory() ), 'assets', DIRECTORY_SEPARATOR, 'editor-scripts.js' ) )
			);

			wp_localize_script(
				'headless-wp/editor-scripts',
				'HeadlessWp',
				array(
					'frontend_origin' => get_frontend_origin(),
				)
			);
		}
	}
);

/**
 * Adds the editor-scripts to the block editor.
 */
add_action(
	'enqueue_block_editor_assets',
	function() {
		wp_enqueue_script( 'headless-wp/editor-scripts' );
	}
);

/**
 * Changes the post link preview pre hydration.
 */
add_filter(
	'preview_post_link',
	function( $preview ) {
		return str_replace( get_site_url(), get_frontend_origin(), $preview );
	}
);

/**
 * Changes the sample permlink to the frontend origin.
 */
add_filter(
	'get_sample_permalink',
	function( $permalink ) {
		$permalink[0] = rtrim( str_replace( get_site_url(), get_frontend_origin(), $permalink[0] ), '/' );

		return $permalink;
	}
);

/**
 * Modifies the rest results to use the frontend origin.
 */
function headless_wp_modify_rest( $res ) {
	if ( isset( $res->data['link'] ) ) {
		$res->data['link'] = str_replace( get_site_url(), get_frontend_origin(), $res->data['link'] );
	}
	return $res;
}
add_filter( 'rest_prepare_post', 'headless_wp_modify_rest' );
add_filter( 'rest_prepare_page', 'headless_wp_modify_rest' );

/**
 * Modifies get_permalink.
 */
foreach ( array( 'post', 'page', 'post_type' ) as $type ) {
	add_filter(
		$type . '_link',
		function ( $url, $post_id, $sample ) use ( $type ) {
			if ( is_admin() ) {
				return get_frontend_origin( $url );
			}

			return $url;
		},
		9999,
		3
	);
}

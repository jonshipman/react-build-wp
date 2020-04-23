<?php
/**
 * Handle the redirection on the frontend.
 *
 * @package  Postlight_Headless_WP
 */

/**
 * Handles the redirection on the frontend to the wp-json api.
 *
 * @return void
 */
add_action(
    'template_redirect',
    function () {
        if ( is_singular() ) {
            header(
                sprintf(
                    'Location: /wp-json/wp/v2/%s/%s',
                    get_post_type_object( get_post_type() )->rest_base,
                    get_post()->ID
                )
            );
        } else {
            header( 'Location: /wp-json/' );
        }
    }
);

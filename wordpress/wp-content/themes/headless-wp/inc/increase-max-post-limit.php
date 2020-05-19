<?php

/**
 * Increases the post query ceiling to get all posts for the sitemaps.
 * Limited to specifically 9999 for these calls.
 */
add_filter(
    'graphql_connection_max_query_amount',
    function( $amount, $source, $args, $context, $info  ) {
        if ( $args['first'] === 9999 ) {
            return 9999;
        }

        return $amount;
    },
    10,
    5
);
<?php
/**
 * Add GraphQL mutations.
 *
 * @package  Headless_WP
 */

// check if WPGraphQL plugin is active.
if ( function_exists( 'register_graphql_field' ) ) {
	require_once 'mutations/form.php';
}

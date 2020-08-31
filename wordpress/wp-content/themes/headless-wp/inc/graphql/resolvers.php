<?php
/**
 * Add GraphQL resolvers
 *
 * @package  Headless_WP
 */

// check if WPGraphQL plugin is active.
if ( function_exists( 'register_graphql_field' ) ) {
	require_once 'resolvers/content-node.php';
	require_once 'resolvers/settings.php';
}

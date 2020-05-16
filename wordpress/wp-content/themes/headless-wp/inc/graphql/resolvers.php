<?php
/**
 * Add GraphQL resolvers
 *
 * @package  Postlight_Headless_WP
 */

// check if WPGraphQL plugin is active.
if ( function_exists( 'register_graphql_field' ) ) {
    require_once 'resolvers/nested-menu.php';
    require_once 'resolvers/front-page.php';
    require_once 'resolvers/post.php';
    require_once 'resolvers/form.php';
}

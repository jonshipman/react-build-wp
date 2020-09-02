<?php
/**
 * Theme for the Headless WordPress Starter Kit.
 *
 * Read more about this project at:
 * https://github.com/jonshipman/headless-wp-starter
 *
 * Originally forked from the fine folks from https://github.com/postlight/headless-wp-starter
 *
 * @package  Headless_WP
 */

// Frontend origin.
require_once 'inc/frontend-origin.php';

// ACF commands.
require_once 'inc/class-acf-commands.php';

// Logging functions.
require_once 'inc/log.php';

// CORS handling.
require_once 'inc/headers.php';

// Admin modifications.
require_once 'inc/admin.php';

// Menu hooks and actions.
require_once 'inc/menus.php';

// Add Headless Settings area.
require_once 'inc/acf-options.php';

// Add GraphQL resolvers.
require_once 'inc/content-nodes.php';

// Prevent double HTML entity wrapping.
require_once 'inc/html-entities.php';

// Adds a settings page for options.
require_once 'inc/settings.php';

// The redirect for the frontpage to go to json.
require_once 'inc/redirect.php';

// Increases the maximum post count for sitemaps.
require_once 'inc/increase-max-post-limit.php';

// Add frontend url to the edit-post backend point.
require_once 'inc/add-frontend-url-in-admin.php';

// Authentication secret.
require_once 'inc/jwt.php';

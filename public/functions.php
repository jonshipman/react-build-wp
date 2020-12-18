<?php
/**
 * React Build functions and definitions
 *
 * @package React Build
 * @since 1.0.0
 */

// Menus in use by theme.
require_once __DIR__ . DIRECTORY_SEPARATOR . 'includes' . DIRECTORY_SEPARATOR . 'menus.php';

// Hide menus not suitable for production.
require_once __DIR__ . DIRECTORY_SEPARATOR . 'includes' . DIRECTORY_SEPARATOR . 'debug-off.php';

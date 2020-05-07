<?php
/**
 * Adds a settings screen.
 *
 * @package  Postlight_Headless_WP
 */

define( 'HEADLESS_WP_KEY', 'headless_wp' );

/**
 * Adds settings to the wp-admin.
 *
 * @return void
 */
add_action(
    'admin_menu',
    function () {
        add_options_page(
            __( 'Headless Theme Settings', 'postlight-headless-wp' ),
            __( 'Headless Theme', 'postlight-headless-wp' ),
            'manage_options',
            HEADLESS_WP_KEY,
            'headless_wp_settings_display_options_page'
        );
    }
);

/**
 * This is the output for the settings page.
 */
function headless_wp_settings_display_options_page() {
    ob_start();
    settings_fields( HEADLESS_WP_KEY );
    do_settings_sections( HEADLESS_WP_KEY );
    submit_button();
    $settings = ob_get_clean();

    printf(
        '<div class="wrap"><h2>%s</h2><form action="options.php" method="post">%s</form></div>',
        esc_html( get_admin_page_title() ),
        $settings
    );
}

/**
 * This is the action that adds the sections for the options page.
 */
add_action(
    'admin_init',
    function () {
        add_settings_section(
            'headless_wp_google_recaptcha',
            __( 'Google Recaptcha', HEADLESS_WP_KEY ),
            '__return false',
            HEADLESS_WP_KEY
        );

        add_settings_field(
            'headless_wp_google_site_key',
            __( 'Site Key', HEADLESS_WP_KEY ),
            'headless_wp_site_key_cb',
            HEADLESS_WP_KEY,
            'headless_wp_google_recaptcha',
            array( 'label_for' => 'headless_wp_google_site_key' )
        );

        add_settings_field(
            'headless_wp_google_secret_key',
            __( 'Client Secret', HEADLESS_WP_KEY ),
            'headless_wp_secret_key_cb',
            HEADLESS_WP_KEY,
            'headless_wp_google_recaptcha',
            array( 'label_for' => 'headless_wp_google_secret_key' )
        );

        register_setting( HEADLESS_WP_KEY, 'headless_wp_google_site_key', 'sanitize_text_field' );
        register_setting( HEADLESS_WP_KEY, 'headless_wp_google_secret_key', 'sanitize_text_field' );
    }
);

function headless_wp_site_key_cb() {
    $key = get_option( 'headless_wp_google_site_key' );
    echo '<input class="large-text" type="text" name="headless_wp_google_site_key" id="headless_wp_google_site_key" value="' . $key . '"> ';
}

function headless_wp_secret_key_cb() {
    $secret = get_option( 'headless_wp_google_secret_key' );
    echo '<input class="large-text" type="text" name="headless_wp_google_secret_key" id="headless_wp_google_secret_key" value="' . $secret . '"> ';
}

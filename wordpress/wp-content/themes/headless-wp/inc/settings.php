<?php
/**
 * Adds a settings screen.
 *
 * @package  Postlight_Headless_WP
 */

class HeadlessWpSettings {
    const HEADLESS_WP_KEY = 'headless_wp';

    private $settings;

    // Start up the class.
    public function __construct() {
        add_action( 'admin_menu', array( $this, 'admin_menu' ) );
        add_action( 'admin_init', array( $this, 'admin_init' ) );
        add_action( 'init', array( $this, 'register' ) );

        $this->settings = array(
            'google_recaptcha' => array(
                'label' => __( 'Google Recaptcha', 'postlight-headless-wp' ),
                'fields' => array(
                    'google_site_key' => array(
                        'label' => __( 'Site Key', 'postlight-headless-wp' ),
                    ),
                    'google_secret_key' => array(
                        'label' => __( 'Secret Key', 'postlight-headless-wp' )
                    ),
                ),
            ),
            'company_info' => array(
                'label' => __( 'Company Info', 'postlight-headless-wp' ),
                'fields' => array(
                    'phone_number' => array(
                        'label' => __( 'Phone Number', 'postlight-headless-wp' ),
                        'args' => array(
                            'type' => 'string',
                            'sanitize_callback' => 'sanitize_text_field',
                            'show_in_graphql' => true,
                        ),
                    ),
                    'contact_email' => array(
                        'label' => __( 'Contact Email', 'postlight-headless-wp' ),
                        'args' => array(
                            'type' => 'string',
                            'sanitize_callback' => 'sanitize_text_field',
                            'show_in_graphql' => true,
                        ),
                    ),
                    'redirect_page_to_frontend_origin' => array(
                        'label' => __( 'Redirect frontend to React instead of REST API', 'postlight-headless-wp' ),
                        'args' => array(
                            'type' => 'boolean',
                            'sanitize_callback' => function( $var ) {
                                return filter_var( $var, FILTER_SANITIZE_NUMBER_INT );
                            },
                        ),
                    ),
                ),
            )
        );
    }

    // Create the admin menu.
    public function admin_menu() {
        add_options_page(
            __( 'Headless Theme Settings', 'postlight-headless-wp' ),
            __( 'Headless Theme', 'postlight-headless-wp' ),
            'manage_options',
            self::HEADLESS_WP_KEY,
            array( $this, 'display_options_page' )
        );
    }

    // Markup for options page.
    public function display_options_page() {
        ob_start();
        settings_fields( self::HEADLESS_WP_KEY );
        do_settings_sections( self::HEADLESS_WP_KEY );
        submit_button();
        $settings = ob_get_clean();

        printf(
            '<div class="wrap"><h2>%s</h2><form action="options.php" method="post">%s</form></div>',
            esc_html( get_admin_page_title() ),
            $settings
        );
    }

    // Builds our settings.
    public function admin_init() {
        foreach ( $this->settings as $group => $options ) {
            add_settings_section(
                $group,
                $options['label'],
                '__return_false',
                self::HEADLESS_WP_KEY
            );

            foreach ( $options['fields'] as $field => $field_options ) {
                if ( isset( $field_options['callback'] ) && is_callable( $field_options['callback'] ) && ! is_string( $field_options['callback'] ) ) {
                    $callback = function() use ( $field ) {
                        $field_options['callback']( $field );
                    };
                } else {
                    $callback = function() use ( $field ) {
                        $value = get_option( $field );

                        if ( isset( $field_options['args'] ) && isset( $field_options['args']['type'] ) ) {
                            if ( 'boolean' === $field_options['args']['type'] ) {
                                printf(
                                    '<select name="%s" id="%s"><option value="0" %s>No</option><option value="1" %s>Yes</option></select>',
                                    esc_attr( $field ),
                                    esc_attr( $field ),
                                    selected($value, '0', false),
                                    selected($value, '1', false)
                                );

                                return;
                            }
                        }

                        printf(
                            '<input class="large-text" type="text" name="%s" id="%s" value="%s"> ',
                            esc_attr( $field ),
                            esc_attr( $field ),
                            esc_attr( $value )
                        );
                    };
                }
                add_settings_field(
                    $field,
                    $field_options['label'],
                    $callback,
                    self::HEADLESS_WP_KEY,
                    $group,
                    array( 'label_for' => $field )
                );
            }
        }
    }

    // Register the settings on the frontend too for wp-graphql.
    public function register() {
        foreach ( $this->settings as $group => $options ) {
            foreach ( $options['fields'] as $field => $field_options ) {
                if ( ! empty( $field_options['args'] ) ) {
                    register_setting(
                        self::HEADLESS_WP_KEY,
                        $field,
                        $field_options['args']
                    );
                } else {
                    register_setting(
                        self::HEADLESS_WP_KEY,
                        $field,
                        'sanitize_text_field'
                    );
                }
            }
        }
    }
}

new HeadlessWpSettings();

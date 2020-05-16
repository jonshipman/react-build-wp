<?php
/**
 * Menu Type used for GraphQL.
 *
 * @package Postlight_Headless_WP
 */

add_action(
    'graphql_register_types',
    function () {
        register_graphql_object_type(
            'NestedMenuType',
            array(
                'description' => __( 'WordPress Menu', 'postlight-headless-wp' ),
                'fields'      => array(
                    'label'       => array(
                        'type'        => 'String',
                        'description' => __( 'The URL label', 'postlight-headless-wp' ),
                    ),
                    'url'         => array(
                        'type'        => 'String',
                        'description' => __( 'The URL', 'postlight-headless-wp' ),
                    ),
                    'type'        => array(
                        'type'        => 'String',
                        'description' => __( 'object type', 'postlight-headless-wp' ),
                    ),
                    'hasChildren' => array(
                        'type'        => 'Boolean',
                        'description' => __( 'whether or not the item has children', 'postlight-headless-wp' ),
                    ),
                    'itemID'      => array(
                        'type'        => 'Integer',
                        'description' => __( 'WordPress internal ID for the menu item', 'postlight-headless-wp' ),
                    ),
                    'children'    => array(
                        'type'        => array( 'list_of' => 'Integer' ),
                        'description' => __( 'children id array', 'postlight-headless-wp' ),
                    ),
                    'parent'      => array(
                        'type'        => 'Integer',
                        'description' => __( 'item\'s parent', 'postlight-headless-wp' ),
                    ),
                ),
            )
        );
    }
);

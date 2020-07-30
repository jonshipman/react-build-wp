<?php

// Adds unique id to the settings type.
add_action(
	'graphql_register_types',
	function () {
		$types = array( 'Settings', 'HeadlessWpSettings', 'DiscussionSettings', 'GeneralSettings', 'ReadingSettings', 'WritingSettings' );

		foreach ( $types as $type ) {
			register_graphql_field(
				$type,
				'id',
				array(
					'type'        => 'ID',
					'description' => __( 'Id for merging in cache', 'headless-wp' ),
					'resolve'     => function () use ( $type ) {
						return \GraphQLRelay\Relay::toGlobalId( 'setting', $type );
					},
				)
			);
		}
	}
);

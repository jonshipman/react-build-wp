<?php

// Recommended to set this to a unique key.
// See https://api.wordpress.org/secret-key/1.1/salt/.
add_filter(
	'graphql_jwt_auth_secret_key',
	function() {
		return SECURE_AUTH_KEY;
	}
);

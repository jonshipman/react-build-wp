<?php
/**
 * React Bootstrap
 *
 * Main entrypoint for the theme. Allows plugins to modify routing, header, and footer.
 *
 * @package react
 * @since 1.0.0
 */

?><!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<meta
			name="viewport"
			content="width=device-width, initial-scale=1, shrink-to-fit=no"
		/>
		<meta name="theme-color" content="#000000" />

		<link rel="manifest" href="<?php echo esc_url( get_stylesheet_directory_uri() ); ?>/manifest.json" />

		<title><?php wp_title(); ?></title>
		<?php wp_head(); ?>
	</head>
	<body>
		<noscript>
			You need to enable JavaScript to run this app.
		</noscript>

		<?php
		// Function will be used to output the results of CRA. Escaping not used to ensure future updates are processed.
		// phpcs:disable WordPress.Security.EscapeOutput.OutputNotEscaped
		echo rbld_get_build();
		// phpcs:enable
		?>

		<?php wp_footer(); ?>
	</body>
</html>

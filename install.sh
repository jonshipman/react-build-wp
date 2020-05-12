#!/bin/bash

cd ./wordpress

# This assumes the ./wordpress directory already has WordPress installed (through Plesk, Cpanel, or manually. Uncomment below to install.

# curl -sL https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar -o wp; \
#	chmod +x wp; \
#	sudo mv wp /bin/;

# wp core download --force

# Required to build the .htaccess file
wp rewrite structure '/%postname%/'

wp theme activate headless-wp
wp theme delete twentysixteen twentyseventeen twentynineteen twentytwenty

wp plugin delete akismet hello

wp plugin install --activate --force \
		advanced-custom-fields \
		custom-post-type-ui \
		wordpress-importer \
		bulkpress \
		wordpress-seo \
		export-import-menus \
		https://github.com/wp-graphql/wp-graphql/archive/develop.zip \
		https://github.com/wp-graphql/wp-graphql-jwt-authentication/archive/develop.zip \
		https://github.com/wp-graphql/wp-graphql-custom-post-type-ui/archive/master.zip \
		https://github.com/wp-graphql/wp-graphql-acf/archive/develop.zip \
		https://github.com/ashhitch/wp-graphql-yoast-seo/archive/master.zip

wp term update category 1 --name="Sample Category"
wp post delete 1 2

cd ../httpdocs

yarn && yarn start

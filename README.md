# React Build to WordPress Theme

This repo shows the process in how https://github.com/jonshipman/react-wp-gql works as well as provides a base for how to get Create-React-App into a standard WordPress theme.

All WordPress integration is done inside the ./public folder and involves outputting the index.html with str_replace for the static uris. Adds a __WP window global variables for use inside the theme. During ``yarn start`` development, add these urls to ./src/config.js to develop without needing to build on each change.
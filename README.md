My take on the [WordPress + React Starter Kit by Postlight](https://github.com/postlight/headless-wp-starter).

I wanted something a little leaner to deploy and more catered to my working environment. This fork will be evolving but here are a few key points that differ from the Postlight kit:

1. **Removed the REST API.** It's still in WordPress, however, I've jumped with both feet into GraphQL. As such, I didn't need the react source for interacting with the WordPress json api.
2. **Latest WP-GraphQL.** There is an ACF plugin for WP-GraphQL, but it supports 0.8 and above. As my projects tend to lock into plugins at setup, I've made the install.sh use the latest from their github as opposed to locking it down. * Note: this does change how types get registered.
3. **No Docker.** I might setup something, but if you need a docker script, the [Postlight repo](https://github.com/postlight/headless-wp-starter) has all you need.
4. **Added a couple graphql resolvers.** I removed the header menu and replaced it with a nested menu (and matching react component). The difference being you can pull in menus by location and create nested (dropdown) menus. There's also a frontPage resolver that pulls in the page set to page_on_front as well as a acf location filter for added fields.
5. **Tachyon CSS is imported into the project's SASS.** The benefit is that you can extend classes from tachyon in your project scss files.

Basically, I wanted something I can wget on the server and run a .sh file to build. We setup WordPress through Plesk so the intial WordPress building is not included, but if you replace the Postlight frontend-graphql folder with my httpdocs folder and replace the wordpress theme, it should work in Postlight's environment.
# And another headless WordPress|React|Apollo frontend.

I wanted something a little leaner to deploy and more catered to my working environment. The frontend has all that a growing site boilerplate needs. You got some post content (under src/components/posts), a lead form (that mutates to a WordPress action for further processing), a homepage, an archive/blog component, a single component with a preview hoc and more.

Originally forked from [WordPress + React Starter Kit by Postlight](https://github.com/postlight/headless-wp-starter)

Some notes:
1.  **No yarn.lock**. Since all the apollo imports and wp-graphql libraries are in beta, whenever I fire up a new project, it should pull in the latest. Let's me keep the boilerplate up-to-date and contribute to those repos as needed.
2.  **Express server**. The boilerplate has an optional express server that can be started with *yarn start:server* or *yarn deploy*. As a feature, it generates a sitemap at sitemap_index.xml pulling data from the WordPress backend. The structure should be compatible with Yoast (though I'm not pulling Yoast settings). Just indexes categories, posts, and pages. Uses React's Router so the CSR and SSR should not need any special tweaking.
3.  **Functional and Class Components**. I see this thrown around, that you should use one or the other. This project has both. From my POV, if you have something you don't want rendered on the server, a class component with componentDidMount suits me just fine.
4.  **JWT Login and Post Previews**. Something that didn't work with Postlight's boilerplate was graphql previews. As long as your WordPress install is sending the Auth headers, you can view previews after logging in. For now, still uses their preview link structure.
5. **LeadForm**. By default, the form will email the admin_email in the WordPress install. This is configured in headless-wp/inc/form-actions.php by way of custom filters processed in the mutations file. Eventually, I want the headless theme to be filled with actions and filters so it can live as a parent theme and not only a boilerplate.
6. **ReCaptcha**. Supports ReCaptcha OOTB. Has a Settings/Headless Settings area where you enter your v3 key and secret. Next, you add a field that you want to trigger loading the javascript - so the actual external library doesn't actually load until a user focuses on that field.
7. **WPBakery**. Many of my existing clients are in WPBakery themes. Being that it is, I have included hooks that render bakery shortcodes in graph-ql and have included (but not imported) sass styles I translated to tachyons. Just import the _wpb.scss in the main styles.scss.

Removed much of the Postlight references as the fork has gotten pretty deviated from the original project. Once I have some time, I plan on backporting some changes into pull requests in Postlight's repo.
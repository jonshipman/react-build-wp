const domain = "http://localhost";

const WP = (window || {}).__WP || {};

export const gqlUrl = WP.GQLURL || `${domain}/graphql`;

export const THEME_URL = WP.THEME_URL || `${domain}/wp-content/themes/build`;

export const isLocalhost = !window.__WP;

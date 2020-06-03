import express from 'express';
import path from 'path';
import serverRenderer from './middleware/renderer';
import robots from './middleware/robots';
import sitemap from './middleware/sitemap';

const PORT = 3000;

// initialize the application and create the routes
const app = express();
const router = express.Router();
const build_path = path.resolve(__dirname, '..', 'build');

// root (/) should always serve our server rendered page
router.use('^/$', serverRenderer);
router.use('^/index.html$', serverRenderer);
router.use('^/robots.txt$', robots);

// Sitemaps
router.use('^/sitemap_index.xml$', sitemap);
router.use('^/post-sitemap.xml$', sitemap);
router.use('^/page-sitemap.xml$', sitemap);
router.use('^/category-sitemap.xml$', sitemap);

// other static resources should just be served as they are
router.use(express.static(
  build_path,
  { maxAge: '30d' },
));

router.use(serverRenderer);

// tell the app to use the above rules
app.use(router);

// start the app
app.listen(PORT, (error) => {
  if (error) {
    return console.log('something bad happened', error);
  }

  console.log("listening on " + PORT + "...");
});
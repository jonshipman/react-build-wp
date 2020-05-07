import express from 'express';
import path from 'path';
import serverRenderer from './middleware/renderer';

const PORT = 3000;

// initialize the application and create the routes
const app = express();
const router = express.Router();
const build_path = path.resolve(__dirname, '..', 'build');

// root (/) should always serve our server rendered page
router.use('^/$', serverRenderer);

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
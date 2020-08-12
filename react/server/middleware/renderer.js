import React from "react";
import { StaticRouter } from "react-router-dom";
import { Helmet } from "react-helmet";

import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  HttpLink,
} from "@apollo/client";
import { renderToStringWithData } from "@apollo/react-ssr";

import Config, { FRONTEND_URL } from "../../src/config";
import App from "../../src/components/App";

global.ReactComponent = <React.Component />;
Helmet.canUseDOM = false;
React.useLayoutEffect = React.useEffect;

const path = require("path");
const fs = require("fs");
const context = {};

const errorPage = (error) => {
  return new Promise((res, rej) => {
    const filePath = path.resolve(
      __dirname,
      "..",
      "..",
      "build",
      `error-${error}.html`
    );

    fs.readFile(filePath, "utf8", (err, htmlData) => {
      if (err) {
        rej(`${error} status error`);
      }

      res(htmlData);
    });
  });
};

export default (req, res) => {
  const client = new ApolloClient({
    ssrMode: true,
    link: new HttpLink({
      uri: Config.gqlUrl,
      fetch: fetch,
      credentials: "include",
      headers: {
        cookie: req.header("Cookie"),
        origin: FRONTEND_URL,
      },
    }),
    cache: new InMemoryCache(),
  });

  const filePath = path.resolve(__dirname, "..", "..", "build", "index.html");

  fs.readFile(filePath, "utf8", (err, htmlData) => {
    if (err) {
      console.error("err", err);

      return res
        .status(500)
        .send(
          "<html><head><title>500 Error</title></head><body><h1>500 Status Error</h1><h2>Did you forget to yarn build?</h2></body></html>"
        )
        .end();
    }

    const tree = (
      <StaticRouter location={req.url} context={context}>
        <ApolloProvider client={client}>
          <App />
        </ApolloProvider>
      </StaticRouter>
    );

    renderToStringWithData(tree)
      .then((content) => {
        const helmet = Helmet.renderStatic();
        const initialState = client.extract();

        htmlData = htmlData.replace(
          /<title>.*?<\/title>/,
          `
          ${helmet.title.toString()}
          ${helmet.link.toString()}
          ${helmet.meta.toString()}
          ${helmet.script.toString()}
          ${helmet.noscript.toString()}
          ${helmet.style.toString()}
          `
        );

        htmlData = htmlData.replace(
          /window\.__REACT_HYDRATE__=.*?<\/script/,
          "window.__REACT_HYDRATE__=true</script"
        );

        htmlData = htmlData.replace(
          '<div id="root"></div>',
          `<div id="root">${content}</div><script>window.__APOLLO_STATE__=${JSON.stringify(
            initialState
          ).replace(/</g, "\\u003c")};</script>`
        );

        if (/status-code-404/.test(htmlData)) {
          res.status(404);
        } else {
          res.status(200);
        }

        res.send(htmlData).end();
      })
      .catch(async (error) => {
        console.log("500 renderer error", error);

        const page = await errorPage(500);

        res.status(500).send(page).end();
      });
  });
};

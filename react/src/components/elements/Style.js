import React from "react";

export default ({ children }) => (
  <style
    type="text/css"
    // eslint-disable-next-line react/no-danger
    dangerouslySetInnerHTML={{ __html: children }}
  />
);

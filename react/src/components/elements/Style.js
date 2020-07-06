import React from "react";

export default ({ style }) => (
  <style
    type="text/css"
    // eslint-disable-next-line react/no-danger
    dangerouslySetInnerHTML={{ __html: style }}
  />
);

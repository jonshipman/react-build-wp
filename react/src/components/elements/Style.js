import React from "react";

export default function Style({ children }) {
  return (
    <style
      type="text/css"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: children }}
    />
  );
}

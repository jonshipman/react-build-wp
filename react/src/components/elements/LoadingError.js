import React from "react";

export default function LoadingError({ error = "" }) {
  return <>{`Error: ${error}`}</>;
}

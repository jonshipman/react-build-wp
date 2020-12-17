import React from "react";
import { PageWidth, PostContent, useNode } from "react-wp-gql";

export const Home = () => {
  const { node } = useNode();

  return (
    <PageWidth>
      <PostContent>{node.content}</PostContent>
    </PageWidth>
  );
};

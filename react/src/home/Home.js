import React from "react";
import { PageWidth, PostContent, useNode } from "react-boilerplate-nodes";

export const Home = () => {
  const { node } = useNode();

  return (
    <PageWidth>
      <PostContent>{node.content}</PostContent>
    </PageWidth>
  );
};

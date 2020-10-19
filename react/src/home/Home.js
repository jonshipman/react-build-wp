import React from "react";
import { PageWidth, PostContent, useSingle } from "react-boilerplate-nodes";

export const Home = () => {
  const { node } = useSingle();

  return (
    <PageWidth>
      <PostContent>{node.content}</PostContent>
    </PageWidth>
  );
};

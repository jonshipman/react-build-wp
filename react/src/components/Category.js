import React from "react";

import { ArchiveLayout } from "./Archive";
import Seo from "./elements/Seo";
import Title from "./elements/Title";
import useCategory from "./hooks/useCategory";

const Category = () => {
  const {
    category: { name, uri, seo = {} },
    edges,
    loading,
    error,
    ...props
  } = useCategory();

  const layoutProps = {
    edges,
    loading,
    error,
    ...props,
  };

  return (
    <>
      <Seo title={seo.title} canonical={uri} />

      <Title>{name}</Title>
      <ArchiveLayout {...layoutProps} />
    </>
  );
};

export default Category;
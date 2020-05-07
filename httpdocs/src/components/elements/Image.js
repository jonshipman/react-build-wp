import React from 'react';

export default props => {
  let { src, webp, width, height, alt, ...attr } = props;

  if (width) {
    if (Number.isInteger(width)) {
      width = `${width}px`;
    }

    attr = { ...attr, width };
  }

  if (height) {
    if (Number.isInteger(height)) {
      height = `${height}px`;
    }
    attr = { ...attr, height };
  }

  if (!alt) {
    alt = src;
  }

  const ImgTag = <img src={src} alt={alt} {...attr} />

  if (!webp) {
    return ImgTag;
  }

  return (
    <picture>
      <source srcSet={webp} type="image/webp" />
      {ImgTag}
    </picture>
  );
};
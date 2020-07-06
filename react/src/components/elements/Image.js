import React from "react";

export const PlacholderUrl = ({ width, height }) => {
  let src = "https://www.fillmurray.com/";

  if (width) {
    src += parseInt(width);
  } else {
    src += "720";
  }

  src += "/";

  if (height) {
    src += parseInt(height);
  } else {
    src += "480";
  }

  return src;
};

export default (props) => {
  let { src, webp, width, height, alt, placeholder, ...attr } = props;

  if (placeholder || !src) {
    src = PlacholderUrl({ width, height });
  }

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

  const ImgTag = <img src={src} alt={alt} {...attr} />;

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

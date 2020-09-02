class _Persistent {
  isWebpSupported = () => {
    if (typeof this.support !== "undefined") return this.support;

    const elem =
      typeof document === "object" ? document.createElement("canvas") : {};

    this.support =
      elem.toDataURL("image/webp").indexOf("data:image/webp") === 0;

    return this.support;
  };
}

const Persistent = new _Persistent();
export const { isWebpSupported } = Persistent;

export const screen = {
  notSmall: () => matchMedia("screen and (min-width: 30em)").matches,
  medium: () =>
    matchMedia("screen and (min-width: 30em) and (max-width: 60em)").matches,
  large: () => matchMedia("screen and (min-width: 60em)").matches,
  print: () => matchMedia("print").matches,
};

export const isMobile = () => {
  return !screen.large();
};

export const preventHangingWords = (str) => {
  str = str.split(" ");
  str.splice(str.length - 2, 0, "<nobr>");
  str.push("</nobr>");
  return str.join(" ");
};

export const preventPhoneNumberSpliting = (str) => {
  let ret = "";

  str = str.replace(") ", ")%%");

  str = str.split(" ");
  str.forEach((s) => {
    if (isPhone(s)) {
      s = `<nobr>${s}</nobr>`;
    }

    ret += ` ${s}`;
  });

  ret = ret.replace(")%%", ") ");

  return ret;
};

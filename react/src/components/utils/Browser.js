class BrowserClass {
  screen = {
    notSmall: () => window.matchMedia("screen and (min-width: 30em)").matches,
    medium: () =>
      window.matchMedia("screen and (min-width: 30em) and (max-width: 60em)")
        .matches,
    large: () => window.matchMedia("screen and (min-width: 60em)").matches,
    print: () => window.matchMedia("print").matches,
  };

  isMobile = () => {
    return !this.screen.large();
  };

  isWebpSupported = () => {
    if (typeof this.support !== "undefined") return this.support;

    const elem =
      typeof document === "object" ? document.createElement("canvas") : {};

    this.support =
      elem.toDataURL("image/webp").indexOf("data:image/webp") === 0;

    return this.support;
  };
}

const Browser = new BrowserClass();
export const { isWebpSupported, isMobile, screen } = Browser;

export default Browser;

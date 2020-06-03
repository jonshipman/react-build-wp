class BrowserClass {
  constructor() {
    this.vw = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
  }

  isMobile = () => {
    return this.vw <= 960;
  }

  isWebpSupported = () => {
    if (typeof this.support !== "undefined")
        return this.support;

    const elem = typeof document === 'object' ? document.createElement('canvas') : {};

    this.support = elem.toDataURL('image/webp').indexOf('data:image/webp') === 0;

    return this.support;
  }
}

const Browser = new BrowserClass();
export const { isWebpSupported, isMobile } = Browser;

export default Browser;
class _sharedScrollHandler {
  functions = [];
  attached = false;

  constructor() {
    this.handleScroll = this._handleScroll.bind(this);
    this.add = this._add.bind(this);
    this.remove = this._remove.bind(this);
  }

  attach() {
    if (!this.attached) {
      window.addEventListener("scroll", this.handleScroll, true);
      this.attached = true;
    }
  }

  detach() {
    if (this.functions.length < 1) {
      window.removeEventListener("scroll", this.handleScroll, true);
      this.attached = false;
    }

    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  _handleScroll() {
    const props = {
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight,
      x: window.scrollX,
      y: window.scrollY,
    };

    if (this.functions?.length > 0) {
      if (this.timeout) {
        clearTimeout(this.timeout);
      }

      this.timeout = setTimeout(() => {
        this.functions.forEach((fn) => {
          fn(props);
        });
      }, 500);
    }
  }

  _add(fn) {
    const check = this.functions.filter((f) => f === fn);
    if (check.length === 0) {
      this.functions.push(fn);
    }

    this.attach();
  }

  _remove(fn) {
    this.functions = this.functions.filter((f) => f !== fn);

    this.detach();
  }
}

export default new _sharedScrollHandler();

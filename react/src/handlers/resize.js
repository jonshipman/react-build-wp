class _sharedResizeHandler {
  functions = [];
  attached = false;
  timeout = null;

  constructor() {
    this.handleResize = this._handleResize.bind(this);
    this.add = this._add.bind(this);
    this.remove = this._remove.bind(this);
  }

  attach() {
    if (!this.attached) {
      window.onresize = this.handleResize;
      this.attached = true;
    }
  }

  detach() {
    if (this.functions.length < 1) {
      window.removeEventListener("resize", this.handleResize);
      this.attached = false;
    }

    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  _handleResize() {
    const props = {
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight,
    };

    if (this.functions?.length > 0) {
      if (this.timeout) {
        clearTimeout(this.timeout);
      }

      this.timeout = setTimeout(() => {
        this.functions.forEach((fn) => {
          if (fn.condition(props)) {
            fn.fn(props);
          }
        });
      }, 500);
    }
  }

  // Second parameter is a check on when to exec.
  // Example: Switching from mobile to desktop widths.
  _add(fn, condition=() => true) {
    const check = this.functions.filter((f) => f.fn === fn);
    if (check.length === 0) {
      this.functions.push({ fn, condition });
    }

    this.attach();
  }

  _remove(fn) {
    this.functions = this.functions.filter((f) => f.fn !== fn);

    this.detach();
  }
}

export default new _sharedResizeHandler();

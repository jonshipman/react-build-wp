class _sharedScrollHandler {
  functions = []
  rebounce = []
  attached = false
  canFire = true

  constructor() {
    this.handleScroll = this._handleScroll.bind(this);
    this.add = this._add.bind(this);
    this.remove = this._remove.bind(this);
  }

  debounce() {
    this.canFire = false;

    this.timeout = setTimeout(() => {
      this.canFire = true;
    }, 600);
  }

  attach() {
    if (!this.attached) {
      window.addEventListener('scroll', this.handleScroll, true);
      this.attached = true;
    }
  }

  detach() {
    if (this.functions.length < 1 && this.rebounce.length < 1) {
      window.removeEventListener('scroll', this.handleScroll, true);
      this.attached = false;
    }

    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    this.canFire = true;
  }

  _handleScroll() {
    if (this.rebounce?.length > 0) {
      this.rebounce.forEach(fn => fn({ width: document.documentElement.clientWidth, height: document.documentElement.clientHeight }));
    }

    if (this.functions?.length > 0 && this.canFire) {
      this.debounce();

      this.functions.forEach(fn => {
        fn({ width: document.documentElement.clientWidth, height: document.documentElement.clientHeight });
      });
    }
  }

  _add(fn, debounce=true) {
    if (debounce) {
      const check = this.functions.filter(f => f === fn);
      if (check.length === 0) {
        this.functions.push(fn);
      }
    } else {
      const check = this.rebounce.filter(f => f === fn);
      if (check.length === 0) {
        this.rebounce.push(fn);
      }
    }

    this.attach();
  }

  _remove(fn) {
    this.functions = this.functions.filter(f => f !== fn);
    this.rebounce = this.rebounce.filter(f => f !== fn);

    this.detach();
  }
}

export default new _sharedScrollHandler();
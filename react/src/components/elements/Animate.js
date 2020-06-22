import React, { Component, createRef } from 'react';

import scrollHandler from '../../handlers/scroll';

export default class extends Component {
  state = {
    inViewPort: false,
  };

  ref = createRef();

  constructor(props) {
    super(props);

    this.handleScrollBound = this.handleScroll.bind(this);
  }

  componentDidMount() {
    this.handleScroll({ height: document.documentElement.clientHeight });
    scrollHandler.add(this.handleScrollBound, false);
  }

  componentWillUnmount() {
    scrollHandler.remove(this.handleScrollBound);
  }

  handleScroll({ height }) {
    const ele = this.ref.current;
    const boundingRect = ele.getBoundingClientRect();

    if (boundingRect.top - height < 0) {
      this.setState({ inViewPort: true });
    } else {
      this.setState({ inViewPort: false });
    }
  }

  render() {
    const { children, className, animate, ...props } = this.props;
    const { inViewPort } = this.state;

    let c = className || '';

    if (inViewPort) {
      let a = (animate || 'fadeIn').split(' ');
      a = a.map(_ => `animate__${_}`).join(' ');
      c += ` animate__animated ${a}`;
    }

    return (
      <div ref={this.ref} className={c} { ...props }>
        {children}
      </div>
    );
  }
}

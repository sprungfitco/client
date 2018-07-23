/* global document */
import PropTypes from 'prop-types';
import React, { Component } from 'react';

const propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  id: PropTypes.string,
  right: PropTypes.bool,
  isOpen: PropTypes.bool,
  handleView: PropTypes.func,
};

class Popover extends Component {
  constructor(props) {
    super();
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.toggleIsOpen = this.toggleIsOpen.bind(this);
    this.domNode = null;
    this.state = {
      isOpen: props.isOpen !== undefined ? props.isOpen : false,
    };
  }

  componentDidMount() {
    document.addEventListener('click', this.handleClickOutside, false);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClickOutside, false);
  }

  handleClickOutside(e) {
    const { domNode } = this;
    const { isOpen } = this.state;
    if (e.target.className === 'ion-close') return;
    if (isOpen
    && ((!domNode || !domNode.contains(e.target)) || e.target.tagName === 'A')) {
      this.setState({ isOpen: false });
    }
  }

  toggleIsOpen(e) {
    e.preventDefault();
    const { isOpen } = this.state;
    this.setState({ isOpen: !isOpen });
    if (this.props.handleView) {
      this.props.handleView(this.state.isOpen);
    }
  }

  renderPanel() {
    const { isOpen } = this.state;
    const { children } = this.props;

    if (isOpen) {
      return (
        <div className="popover__panel">
          {children.slice(1).map((child) =>
            child
          )}
        </div>
      );
    }

    return null;
  }

  render() {
    const { children, right } = this.props;
    const { isOpen } = this.state;
    const className = this.props.className || '';
    const key = this.props.id;

    return (
      <div
        className={`hx__popover ${className} ${isOpen ? 'popover--open' : ''} ${right ? 'popover--right' : ''}`}
        ref={node => (this.domNode = node)}
      >
        <a {...(key && { id: key })} className="popover__trigger" onClick={this.toggleIsOpen}>
          {children[0]}
        </a>
        {this.renderPanel()}
      </div>
    );
  }
}

Popover.propTypes = propTypes;

export default Popover;

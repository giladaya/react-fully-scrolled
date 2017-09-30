import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Section extends Component {
  static defaultProps = {
    children: {},
    className: 'pagescroll',
  }

  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {};
  }

  render() {
    return (
      <section
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
        }}
        className={this.props.className}
      >
        {this.props.children}
      </section>
    );
  }
}

export default Section;

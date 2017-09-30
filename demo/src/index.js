import React from 'react'
import { render } from 'react-dom'

import './main.css';
import { Scroller, Section } from '../../src';

// mobile safari compatibility
document.ontouchmove = function (ev) {
  ev.preventDefault();
}

/* eslint-disable no-console */
function onAfterScroll(page) {
  console.log(`Scrolled to ${page}`)
}
/* eslint-enable no-console */

const scrollEnabled = true;

class Demo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sections: ['#FF8888', '#88FF88', '#8888FF', '#88FFFF'],
    };
  }

  static getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  doFetch = (count) => {
    const newSections = [];
    for (let i = 0; i < count; i++) {
      newSections.push(Demo.getRandomColor());
    }

    this.setState({
      sections: this.state.sections.concat(newSections),
    })
  }

  onBeforeScroll = (from, to) => {
    if (to > from && this.state.sections.length - to < 3) {
      this.doFetch(3)
    }
  }

  renderItems = () => this.state.sections.map((color, idx) =>
    <Section key={`${idx}`}>
      <div className="section" style={{ backgroundColor: color }}>
        {color}
      </div>
    </Section>
    )

  render() {
    return (
      <div>
        <Scroller
          initialPage={2}
          onBeforeScroll={this.onBeforeScroll}
          onAfterScroll={onAfterScroll}
          isEnabled={scrollEnabled}
        >
          {this.renderItems()}
        </Scroller>
      </div>
    )
  }
}

render(<Demo />, document.querySelector('#demo'))

import React from 'react'
import {render} from 'react-dom'

import './main.css';
import { Scroller, Section } from '../../src';

/* eslint-disable no-console */
function onBeforeScroll(from, to) {
  console.log(`Scrolling from ${from} to ${to}`)
}

function onAfterScroll(page) {
  console.log(`Scrolled to ${page}`)
}
/* eslint-enable no-console */

const scrollEnabled = true;

class Demo extends React.Component {
  render() {
    return (
      <div>
        <Scroller
          initialPage={2}
          onBeforeScroll={onBeforeScroll}
          onAfterScroll={onAfterScroll}
          isEnabled={scrollEnabled}
        >
          <Section key="one">
            <div id="section_one" className="section">
              One
            </div>
          </Section>
          <Section key="two">
            <div id="section_two" className="section">
              Two
            </div>
          </Section>
          <Section key="three">
            <div id="section_three" className="section">
              Three
            </div>
          </Section>
          <Section key="four">
            <div id="section_four" className="section">
              Four
            </div>
          </Section>
        </Scroller>
      </div>
    )
  }
}

render(<Demo/>, document.querySelector('#demo'))

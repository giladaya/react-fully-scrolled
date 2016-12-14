import expect from 'expect'
import React from 'react'
import {render, unmountComponentAtNode} from 'react-dom'

import {Scroller, Section} from 'src/'

describe('Scroller', () => {
  let node

  beforeEach(() => {
    node = document.createElement('div')
  })

  afterEach(() => {
    unmountComponentAtNode(node)
  })

  it('renders a div', () => {
    render(
      <Scroller>
        <Section>
          One
        </Section>
        <Section>
          Two
        </Section>
      </Scroller>, node, () => {
      expect(node.children[0].tagName).toEqual('DIV')
    })
  })

  it('renders all children', () => {
    render(
      <Scroller>
        <Section>
          One
        </Section>
        <Section>
          Two
        </Section>
      </Scroller>, node, () => {
      expect(node.children[0].childElementCount).toEqual(2)
    })
  })

})

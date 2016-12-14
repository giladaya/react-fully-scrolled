import expect from 'expect'
import React from 'react'
import {render, unmountComponentAtNode} from 'react-dom'

import {Section} from 'src/'

describe('Section', () => {
  let node

  beforeEach(() => {
    node = document.createElement('div')
  })

  afterEach(() => {
    unmountComponentAtNode(node)
  })

  it('renders a section', () => {
    render(<Section>Test</Section>, node, () => {
      expect(node.children[0].tagName).toEqual('SECTION')
    })
  })

  it('renders with correct class', () => {
    render(<Section className="fooBar">Test</Section>, node, () => {
      expect(node.children[0].className).toEqual('fooBar')
    })
  })
})

# React Fully Scrolled

[![npm package][npm-badge]][npm]

A full-page scroll component for react with support for touch events.  
Inspired by [react-fullpage](https://github.com/Toxni/react-fullPage)

* Simple  
* Performant  
* Touch support


[Live Demo](https://giladaya.github.io/react-fully-scrolled/)

## Usage

`npm install react-fully-scrolled`  

For mobile compatibility, make sure to disable touchmove events, like so: 
```js
document.ontouchmove = function(ev) {
  ev.preventDefault();
}
```

### Simple Example

```js
import React, { Component } from 'react'
import { render } from 'react-dom'
import { Scroller, Section } from 'react-fully-scrolled';

class Pages extends React.Component {
  render() {
    return (
      <Scroller
        curPage={1}
        onBeforeScroll={(from, to) => {}}
        onAfterScroll={(page) => {}}
        isEnabled={true}
      >
        <Section>
          Page1
        </Section>
        <Section>
          Page2
        </Section>
        <Section>
          Page3
        </Section>
        <Section>
          Page4
        </Section>
      </Scroller>
    )
  }
}

render(<Pages />, document.getElementById('root'));
```

### API

When the component is mounted, a function is added to the global scope:  
`window.fpTurnTo(pageNum)`

## Contributing
See [CONTRIBUTING.md](CONTRIBUTING.md)


[npm-badge]: https://img.shields.io/npm/v/npm-package.png?style=flat-square
[npm]: https://www.npmjs.org/package/react-fully-scrolled

import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import {findDOMNode} from 'react-dom'

class Scroller extends Component {
  containerEl = null  // the container element
  totalPages = 0      // how many pages we have

  touchStartPosY = 0  // Y position of touch start
  touchMoveDelta = 0  // delta moved from start of swipe
  isInSwipe = false   // whether we're currently in a swipe
  reqAnim = null      // handle to requestAnimationFrame

  isTransitionEnabled = false
  isAnimating = false      // whether we're currently animating
  supportsPassive = false  // whether the browser supports passive events
  animStartTs = Date.now() // timestamp of animation start, for performance tracking

  isScrolling = false

  static defaultProps = {
    children: [],
    easing: 'cubic-bezier(0.19, 1, 0.22, 1)',
    initialPage: 1,        // 1-based !
    isEnabled: true,
    onAfterScroll: function () {},
    onBeforeScroll: function () {},
    swipeSensitivity: 100, // how much Y movement there should be to be considered a scroll
    transDuration: 0.5,    // seconds
  }

  static propTypes = {
    children: PropTypes.node,
    easing: PropTypes.string,
    initialPage: PropTypes.number,
    isEnabled: PropTypes.bool,
    onAfterScroll: PropTypes.func,
    onBeforeScroll: PropTypes.func,
    swipeSensitivity: PropTypes.number,
    transDuration: PropTypes.number, // seconds
  };


  constructor(props) {
    super(props);
    this.totalPages = this.props.children.length

    this.state = {
      curPage: this.props.initialPage,
    };
    this.initSupportsPassive();
  }

  initSupportsPassive = () => {
    const that = this;
    try {
      const opts = Object.defineProperty({}, 'passive', {
        get: function () {
          that.supportsPassive = true;
        },
      });
      window.addEventListener('test', null, opts);
    } catch (e) {

    }
  }

  componentDidMount() {
    // this.containerEl = this.refs.container
    // this.containerEl = findDOMNode(this.refs['container']);
    // console.log('Mount', this)
    this.resize();

    this.enableTransition()

    this.addWheelEvent();
    this.addTouchEvents();
    window.addEventListener('resize', this.resize, false);
    document.addEventListener('resize', this.resize, false);

    window.fpTurnTo = document.fpTurnTo = this.turnTo.bind(this);

    this.prevTime = new Date().getTime();
    this.scrollings = [];
  }

  componentWillUnmount() {
    // cleanup
    this.removeWheelEvent()
    this.removeTouchEvents()
    window.removeEventListener('resize', this.resize, false);
    document.removeEventListener('resize', this.resize, false);

    delete window.fpTurnTo
    delete document.fpTurnTo
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.children.length !== this.totalPages) {
      this.totalPages = this.props.children.length
      if (this.state.curPage > this.totalPages) {
        this.turnTo(this.totalPages)
      }
    }
  }

  getAverage = (elements, number) => {
    let sum = 0;
    const lastElements = elements.slice(Math.max(elements.length - number, 1));

    for (let i = 0; i < lastElements.length; i++) {
      sum += lastElements[i];
    }

    return Math.ceil(sum / number);
  }

  resize = () => {
    const translateyStr = `translatey(-${window.innerHeight * (this.state.curPage - 1)}px)`;
    this.setStyles({
      transform: translateyStr,
      height: `${window.innerHeight}px`,
    });
  }

  //--------------
  // Wheel stuff
  //--------------

  handle(delta) {
    if (delta < 0) {
      if (this.state.curPage < this.totalPages) {
        this.enableTransition()
        this.turnTo(this.state.curPage + 1);
      }
    } else {
      /* eslint-disable no-lonely-if */
      if (this.state.curPage > 1) {
        this.enableTransition()
        this.turnTo(this.state.curPage - 1);
      }
      /* eslint-enable no-lonely-if */
    }
  }

  onWheel = (event) => {
    if (!this.props.isEnabled) return;

    const curTime = new Date().getTime();

    const value = event.wheelDelta || -event.deltaY || -event.detail;
    const delta = Math.max(-1, Math.min(1, value));

    if (this.scrollings.length > 149) this.scrollings.shift();
    this.scrollings.push(Math.abs(value));

    const timeDiff = curTime - this.prevTime;
    this.prevTime = curTime;
    if (timeDiff > 200) this.scrollings = [];

    if (this.isAnimating) return;

    const averageEnd = this.getAverage(this.scrollings, 10);
    const averageMiddle = this.getAverage(this.scrollings, 70);
    const isAccelerating = averageEnd >= averageMiddle;

    if (!isAccelerating) return;

    if (delta) this.handle(delta);
  }

  removeWheelEvent() {
    window.removeEventListener('wheel', this.onWheel, this.supportsPassive ? { passive: true } : false);
  }

  addWheelEvent() {
    window.addEventListener('wheel', this.onWheel, this.supportsPassive ? { passive: true } : false);
  }


  //----------------
  // Touch stuff
  //----------------

  handleSwipeEnd = (delta) => {
    if (Math.abs(delta) > this.props.swipeSensitivity) {
      const duration = (1.0 - (Math.abs(delta) / window.innerHeight)) * this.props.transDuration

      this.enableTransition(duration)
      if (delta < 0) {
        if (this.state.curPage < this.totalPages) {
          this.turnTo(this.state.curPage + 1);
        } else {
          this.resetTranslateY()
        }
      } else {
        /* eslint-disable no-lonely-if */
        if (this.state.curPage > 1) {
          this.turnTo(this.state.curPage - 1);
        } else {
          this.resetTranslateY()
        }
        /* eslint-enable no-lonely-if */
      }
    } else if (Math.abs(delta) > 10) {
      this.enableTransition(0.5 * this.props.transDuration)
      this.resetTranslateY(true)
    } else {
      this.resetTranslateY(false)
    }
  }

  updateTouchMove = () => {
    const translatey = -((window.innerHeight * (this.state.curPage - 1)) - this.touchMoveDelta);
    const translateyStr = `translatey(${translatey}px)`;

    this.setStyles({ transform: translateyStr })
    this.reqAnim = requestAnimationFrame(this.updateTouchMove)
  }

  onTouchStart = (e) => {
    if (!this.props.isEnabled || this.isAnimating || this.isInSwipe) return

    this.isInSwipe = true
    this.reqAnim = requestAnimationFrame(this.updateTouchMove)

    this.touchStartPosY = e.touches[0].clientY
    this.disableTransition()
  }

  onTouchMove = (e) => {
    if (!this.props.isEnabled || this.isAnimating || !this.isInSwipe) return

    const touchPosY = e.changedTouches[0].clientY;
    this.touchMoveDelta = touchPosY - this.touchStartPosY;


    // const delta = touchPosY - this.touchStartPosY;

    // const translatey = -(window.innerHeight * (this.state.curPage - 1) - delta);
    // const translateyStr = `translatey(${translatey}px)`;

    // this.setStyles({transform: translateyStr})
  }

  onTouchEnd = (e) => {
    cancelAnimationFrame(this.reqAnim)
    this.touchMoveDelta = 0

    if (!this.props.isEnabled || this.isAnimating || !this.isInSwipe) return

    this.isInSwipe = false

    const touchEndY = e.changedTouches[0].clientY;
    const delta = touchEndY - this.touchStartPosY;

    this.handleSwipeEnd(delta)
  }

  resetTranslateY(animate) {
    const translatey = -(window.innerHeight * (this.state.curPage - 1));
    const translateyStr = `translatey(${translatey}px)`;

    if (animate) this.setIsAnimating(true);
    this.setStyles({ transform: translateyStr })
  }

  addTouchEvents() {
    document.addEventListener('touchstart', this.onTouchStart, this.supportsPassive ? { passive: true } : false);
    document.addEventListener('touchmove', this.onTouchMove, this.supportsPassive ? { passive: true } : false);
    document.addEventListener('touchend', this.onTouchEnd, this.supportsPassive ? { passive: true } : false);
  }
  removeTouchEvents() {
    document.removeEventListener('touchstart', this.onTouchStart, this.supportsPassive ? { passive: true } : false);
    document.removeEventListener('touchmove', this.onTouchMove, this.supportsPassive ? { passive: true } : false);
    document.removeEventListener('touchend', this.onTouchEnd, this.supportsPassive ? { passive: true } : false);
  }

  // assign styles to element
  setStyles = (style) => {
    // const container = this.containerEl;
    // Object.keys(style).forEach(function (key) {
    //   container.style[key] = style[key]
    // })
    Object.keys(style).forEach((key) => {
      this.containerEl.style[key] = style[key]
    })
  }

  enableTransition = (duration = this.props.transDuration) => {
    this.setStyles({ transition: `transform ${duration}s ${this.props.easing}` })
    this.isTransitionEnabled = true
  }

  disableTransition = () => {
    this.setStyles({ transition: 'transform 0s' })
    this.isTransitionEnabled = false
  }

  turnTo(num) {
    if (this.state.curPage === num) return
    this.isScrolling = true
    this.props.onBeforeScroll(this.state.curPage, num);
    const translateyStr = `translatey(-${window.innerHeight * (num - 1)}px)`;

    this.setState({
      curPage: num,
    });

    if (this.isTransitionEnabled) this.setIsAnimating(true);
    this.setStyles({ transform: translateyStr })
    // setTimeout(() => {
    //   this.setIsAnimating(false);
    // }, (TRANS_DURATION*1000 + 50));
  }

  setIsAnimating = (is) => {
    if (is) {
      this.isAnimating = true
      // this.animStartTs = Date.now()
      // console.log('Animating start');
    } else {
      this.isAnimating = false
      // console.log('Animating End after', (Date.now()-this.animStartTs))
    }
  }

  handleTransitionEnd = (e) => {
    this.setIsAnimating(false)
    if (this.isScrolling) {
      this.isScrolling = false
      this.props.onAfterScroll(this.state.curPage);
    }
  }

  render() {
    return (
      <div
        onTransitionEnd={this.handleTransitionEnd}
        ref={(c) => { this.containerEl = c; }}
        style={{
          width: '100%',
          height: '100%',
          position: 'fixed',
        }}
      >
        {this.props.children}
      </div>
    );
  }
}

export default Scroller;

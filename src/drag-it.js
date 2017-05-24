/**
 * Free to drag the HTML element to any place 🍭
 *
 * DragIt v1.0.0
 * https://github.com/Alex-xd/drag-it
 *
 * Copyright 2017 Alex-xd
 * Released under the MIT license
 */
;(function (factory) {
  var registeredInModuleLoader = false

  if (typeof define === 'function' && define.amd) {
    define(factory)
    registeredInModuleLoader = true
  }
  if (typeof exports === 'object') {
    module.exports = factory()
    registeredInModuleLoader = true
  }
  if (!registeredInModuleLoader) {
    var old = window.dragIt
    var api = window.dragIt = factory()
    api.noConflict = function () {
      window.dragIt = old
      return api
    }
  }
})(function () {
  var getCompatibleAttr = (function () {
    var div = document.createElement('div')
    var vendors = 'Khtml O Moz Webkit'.split(' ')
    var len = vendors.length
    return function (prop) {
      if (prop in div.style) return prop
      if ('-ms-' + prop in div.style) return '-ms-' + prop
      prop = prop.replace(/^[a-z]/, function (val) {
        return val.toUpperCase()
      })
      while (len--) {
        if (vendors[len] + prop in div.style) {
          return vendors[len] + prop
        }
      }
      return ''
    }
  })()

  var compatibleTransform = getCompatibleAttr('transform')

  function _typeof(target) {
    var type = Object.prototype.toString.call(target).split(' ')[1].slice(0, -1)
    if (/^HTML.*Element$/.test(type)) {
      type = type.match(/^(HTML)(?:.*)(Element)$/)
      return type[1].concat(type[2])
    }
    return type
  }

  /**
   * Dragging initialization
   * @param dragger required, The dom element which trigger dragging, such as the dialog title bar.
   * @param mover not required, The dom element which is moving actually , such as the entire dialog.
   * @param options not required, Defined Maximum Allows mover to moving out the distance from the current page boundary
   */
  return function dragIt(dragger, mover, options) {
    var defaultOpt = {
      overflowLeft: 100,
      overflowRight: 100,
      overflowTop: 25,
      overflowBottom: 100
    }

    if (!dragger) {
      console.error('[drag-it]: Need at least one param! Please declare a dragger')
    }
    if (_typeof(options) === 'Undefined' && _typeof(mover) === 'Undefined') {
      mover = dragger
    }
    if (_typeof(mover) === 'Object' && _typeof(options) === 'Undefined') {
      options = mover
      mover = dragger
    }

    var opt = Object.assign({}, defaultOpt, options)

    var isDragging = false

    var diffX = 0 // the distance of click from the upper left corner of mover
    var diffY = 0

    var startX = 0 // mover initial position
    var startY = 0

    var moveX = 0 // relative to the distance of mover itself, directly applied to translate
    var moveY = 0

    // Maximum Allows mover to moving out the distance from the current page boundary
    var MAX_X = document.documentElement.clientWidth - mover.offsetWidth + opt.overflowRight // Maximum motion boundary
    var MAX_Y = document.documentElement.clientHeight - mover.offsetHeight + opt.overflowBottom

    var moverStyle = window.getComputedStyle(mover)
    var marginLeft = moverStyle.marginLeft.split('px')[0]
    var marginTop = moverStyle.marginTop.split('px')[0]

    // remove attribute draggable while dragging
    var hasDraggableAttr = mover.getAttribute('draggable') === 'true'
    console.warn('[drag-it]: In order to make the drag working, attribute \'draggable\' was temporarily removed during the dragging, then it will be back.')

    // event handlers
    var mousedown = function (e) {
      var clientX = e.clientX
      var clientY = e.clientY

      if (e.type === 'touchstart') {
        e.preventDefault()  // just apply touchstart event but not mousedown
        clientX = e.touches[0].clientX
        clientY = e.touches[0].clientY
      }
      if (hasDraggableAttr) {
        mover.removeAttribute('draggable')
      }
      startX = mover.offsetLeft
      startY = mover.offsetTop
      diffX = clientX - startX
      diffY = clientY - startY
      isDragging = true
    }

    var mousemove = function (e) {
      if (isDragging) {
        var clientX = e.clientX
        var clientY = e.clientY

        if (e.type === 'touchmove') {
          clientX = e.touches[0].clientX
          clientY = e.touches[0].clientY
        }

        moveX = Math.max(-opt.overflowLeft, Math.min(clientX - diffX, MAX_X)) - startX
        moveY = Math.max(-opt.overflowTop, Math.min(clientY - diffY, MAX_Y)) - startY

        // If the browser does not support transform, the downgrade uses absolute positioning
        if (compatibleTransform) {
          mover.style[compatibleTransform] = 'translate3d(' + moveX + 'px,' + moveY + 'px,0)'
        } else {
          mover.style.left = moveX + startX - marginLeft + 'px'
          mover.style.top = moveY + startY - marginTop + 'px'
        }
      }
    }

    var mouseup = function () {
      if (isDragging) {
        if (hasDraggableAttr) {
          mover.setAttribute('draggable', 'true')
        }
        mover.style.left = moveX + startX - marginLeft + 'px'
        mover.style.top = moveY + startY - marginTop + 'px'
        moveX = 0
        moveY = 0
        mover.style[compatibleTransform] = ''
        isDragging = false
      }
    }

    // improve CSS3 transform performance
    mover.style.willChange = 'transform'

    // Press the mouse in the title bar to get the position of the mouse relative to the title bar,
    // because the user can not click on the title bar is the upper left corner
    dragger.addEventListener('mousedown', mousedown, false)
    dragger.addEventListener('touchstart', mousedown, false)

    // Mouse to move, calculate the distance of the mouse movement,
    // in order to prevent the moving too fast, the mouse is not moving on the title bar,
    // so set on the document
    document.addEventListener('mousemove', mousemove, false)
    document.addEventListener('touchmove', mousemove, false)

    // When mouse is released, change the mover's left top value, and clear the transform proper
    document.addEventListener('mouseup', mouseup, false)
    document.addEventListener('touchend', mouseup, false)

    // change max moved boundary when window has been resized
    var timer = null
    window.addEventListener('resize', function () {
      clearTimeout(timer)
      setTimeout(function () {
        MAX_X = document.documentElement.clientWidth - mover.offsetWidth + opt.overflowRight
        MAX_Y = document.documentElement.clientHeight - mover.offsetHeight + opt.overflowBottom
      }, 200)
    })
  }
})

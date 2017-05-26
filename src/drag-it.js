/**
 * Free to drag the HTML element to any place 🍭
 *
 * DragIt v1.1.3
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
    var old = window.Dragger
    var api = window.Dragger = factory()
    api.noConflict = function () {
      window.Dragger = old
      return api
    }
  }
})(function () {


  'use strict'


  function Dragger(options) {
    var defaultOpt = {
      hasBoundary: false,
      container: document.documentElement,
      overflowLeft: 0,
      overflowRight: 0,
      overflowTop: 0,
      overflowBottom: 0
    }

    this.options = Object.assign({}, defaultOpt, options)


    // The dom element which trigger dragging, such as the dialog title bar.
    this.dragger = null


    // The dom element which is moving actually , such as the entire dialog.
    this.mover = null


    this.isDragging = false


    // the distance of click from the upper left corner of mover
    this.diffX = 0
    this.diffY = 0


    // Maximum Allows mover to moving out the distance from the current page boundary
    this.MAX_X = 0
    this.MAX_Y = 0


    // mover computed style object
    this.moverStyle = null


    // margin can influence absolute position, so need compensation position of mover which if has margins
    this.marginLeft = 0
    this.marginTop = 0


    // remove attribute draggable while dragging
    this.hasDraggableAttr = false


    if (this.options.hasBoundary) {
      var running = false
      var _this = this
      // change max moved boundary when window resizing
      window.addEventListener('resize', function () {
        if (!running) {
          running = true
          if (window.requestAnimationFrame) {
            window.requestAnimationFrame(function () {
              _this.resetMAX(_this.options.container)
              running = false
            })
          } else {
            setTimeout(function () {
              _this.resetMAX(_this.options.container)
              running = false
            }, 66)
          }
        }
      })
    }
  }


  Dragger.prototype.draggable = function (dragger, mover) {
    if (arguments.length === 0) {
      console.error('[drag-it]: Need at least one param! Please declare a dragger')
    }

    if (!mover) {
      this.mover = dragger
    } else {
      this.mover = mover
    }
    this.dragger = dragger


    this.moverStyle = window.getComputedStyle(this.mover)
    this.marginLeft = Number(this.moverStyle.marginLeft.split('px')[0])
    this.marginTop = Number(this.moverStyle.marginTop.split('px')[0])


    if (this.mover.getAttribute('draggable') === 'true') {
      this.hasDraggableAttr = true
      console.warn('[drag-it]: In order to make the drag working, attribute \'draggable\' was temporarily removed during the dragging, then it will be back.')
    }

    if (this.moverStyle.position !== 'absolute' && this.moverStyle.position !== 'fixed') {
      this.mover.style.position = 'fixed'
      console.warn('[drag-it]: the position attribute of mover is \"' + this.moverStyle.position + '\", in order to move it, position attribute has been changed to \"fixed\"')
    }

    // get MAX boundary first time
    this.resetMAX(this.options.container)

    // Press the mouse in the title bar to get the position of the mouse relative to the title bar,
    // because the user can not click on the title bar is the upper left corner
    this.dragger.addEventListener('mousedown', this.onmousedown.bind(this), false)
    this.dragger.addEventListener('touchstart', this.onmousedown.bind(this), false)

    // Mouse to move, calculate the distance of the mouse movement,
    // in order to prevent the moving too fast, the mouse is not moving on the title bar,
    // so set on the document
    document.addEventListener('mousemove', this.onmousemove.bind(this), false)
    document.addEventListener('touchmove', this.onmousemove.bind(this), false)

    // When mouse is released, change the mover's left top value, and clear the transform proper
    document.addEventListener('mouseup', this.onmouseup.bind(this), false)
    document.addEventListener('touchend', this.onmouseup.bind(this), false)
  }


  Dragger.prototype.onmousedown = function (e) {
    var clientX = e.clientX
    var clientY = e.clientY


    if (e.type === 'touchstart') {
      // just apply touchstart event but not mousedown
      e.preventDefault()

      clientX = e.touches[0].clientX
      clientY = e.touches[0].clientY
    }


    if (this.hasDraggableAttr) {
      this.mover.removeAttribute('draggable')
    }


    this.diffX = clientX - this.mover.offsetLeft
    this.diffY = clientY - this.mover.offsetTop


    this.isDragging = true
  }


  Dragger.prototype.onmousemove = function (e) {
    if (this.isDragging) {
      var clientX = e.clientX
      var clientY = e.clientY
      var moveToX = 0
      var moveToY = 0


      if (e.type === 'touchmove') {
        clientX = e.touches[0].clientX
        clientY = e.touches[0].clientY
      }


      if (this.options.hasBoundary) {
        moveToX = Math.max(-this.options.overflowLeft - this.marginLeft, Math.min(clientX - this.diffX - this.marginLeft, this.MAX_X)) + 'px'
        moveToY = Math.max(-this.options.overflowTop - this.marginTop, Math.min(clientY - this.diffY - this.marginTop, this.MAX_Y)) + 'px'
      } else {
        moveToX = clientX - this.diffX - this.marginLeft + 'px'
        moveToY = clientY - this.diffY - this.marginTop + 'px'
      }


      this.mover.style.left = moveToX
      this.mover.style.top = moveToY
    }
  }


  Dragger.prototype.onmouseup = function () {
    if (this.isDragging) {
      if (this.hasDraggableAttr) {
        this.mover.setAttribute('draggable', 'true')
      }
      this.isDragging = false
    }
  }


  Dragger.prototype.resetMAX = function (container) {
    if (!container) {
      container = document.documentElement
    }
    this.MAX_X = container.clientWidth - this.mover.clientWidth - this.marginLeft + this.options.overflowRight
    this.MAX_Y = container.clientHeight - this.mover.clientHeight - this.marginTop + this.options.overflowBottom
  }

  return Dragger
})

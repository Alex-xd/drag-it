![](screenShots/example.gif)


# Drag It

[![npm](https://img.shields.io/badge/npm-1.1.0-blue.svg)](https://www.npmjs.com/package/drag-it)
[![lisence](https://img.shields.io/badge/LISENCE-MIT-green.svg)](https://github.com/Alex-xd/preview-upload)

**Free to drag the HTML element to any place. 🍭**

- Tiny
- No dependence
- High Performance
- Mobile supported
- Easy use


```html
<div class="box">
  <h1>Drag me</h1>
  <p>Hello World</p>
</div>

<script>
  const box = document.querySelector('.box');
  dragIt(box);
</script>
```

[TRY IT NOW](https://alex-xd.github.io/drag-it/)

## Installation

### Direct download

download source file at `src/drag-it.js` and simply include it.

`<script src="/path/to/drag-it.js"></script>`


### Package Managers & Module Loaders

drag-it supports npm under the name "drag-it".

`npm install drag-it` or `yarn add drag-it`

DragIt can also be loaded as an AMD, CommonJS or ES6 module.

`import dragIt from 'drag-it'`

`const dragIt = require('drag-it')`

`require(['drag-it'], callback)`

## Usage

```html
<div class="box">
  <h1>Drag me</h1>
  <p>Hello World</p>
</div>
```

```javascript
const box = document.querySelector('.box');
dragIt(box);
```

## More

It can pass up to three parameters

`dragIt(dragger, mover, options)`

| param | means |required |
|-------|-------|---------|
|dragger|The dom element which trigger dragging, such as the dialog title bar.| yes |
| mover | The dom element which is moving actually, such as the entire dialog. If no declared, the mover will be the dragger. | no|
| options | Defined Maximum Allows mover to moving out the distance from the current page boundary | no|

**Fully declared just like this ↓**

```html
<div class="box">
  <h1 class="header">Drag me</h1>
  <p>Hello World</p>
</div>

<script>
  const box = document.querySelector('.box')
  const header = box.querySelector('.header')
  dragIt(header, box, { // those 4 declares are default value, u can customize it.
    overflowLeft: 100,
    overflowRight: 100,
    overflowTop: 25,
    overflowBottom: 100
  })
</script>
```

## License

[MIT](https://github.com/Alex-xd/drag-it/blob/master/LICENSE)

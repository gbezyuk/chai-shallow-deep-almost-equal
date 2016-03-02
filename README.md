# chai-shallow-deep-almost-equal

It's a fork of https://github.com/michelsalib/chai-shallow-deep-equal which adds .001 float treshold almost-equality feature.

Will shallowly perform a deep almost equal assertion. In other terms is consist of checking that an object, or objects graph, is contained within another one (see examples bellow).

[![NPM version](https://badge.fury.io/js/chai-shallow-deep-almost-equal.png)](http://badge.fury.io/js/chai-shallow-deep-almost-equal)
[![Build Status](https://travis-ci.org/gbezyuk/chai-shallow-deep-almost-equal.png?branch=master)](https://travis-ci.org/gbezyuk/chai-shallow-deep-almost-equal)

## Usage

### Browser

```html
<script src="chai.js"></script>
<script src="chai-shallow-deep-almost-equal.js"></script>
```

### Node

```javascript
var chai = require('chai');
chai.use(require('chai-shallow-deep-almost-equal'));
```

## Assertions

ShallowDeepAlmostEqual is available for all chai assertion styles:

```javascript
var a = {x: 10, y: 10};
var b = {x: 10.001};

a.should.shallowDeepAlmostEqual(b);
expect(a).to.shallowDeepAlmostEqual(b);
assert.shallowDeepAlmostEqual(a, b);
```

## Example

```javascript
assert.shallowDeepAlmostEqual({x: 10, y: 10}, {x: 10.001}); // true
assert.shallowDeepAlmostEqual({x: 10, y: 10}, {x: 9.999}); // true
// assert.ShallowDeepAlmostEqual({x: 10, y: 10}, {x: 9.9}); // fails

// the rest are the original shallowDeepEqualTests
assert.shallowDeepAlmostEqual({
  name: 'Michel',
  language: 'javascript',
  tags: [
    'developer',
    'gamer'
  ]},
  {
  name: 'Michel',
  tags: [
    'developer'
  ]}); // true

assert.shallowDeepAlmostEqual([
    {brand: 'apple', color: 'red'},
    {brand: 'samsung', color: 'blue'},
  ],
  {
  length: 2,
  0: {color: 'red'},
  1: {brand: 'samsung'},
  }); // true

assert.shallowDeepAlmostEqual({
  name: 'Michel',
  age: undefined
  },
  {
  name: 'Michel',
  age: 37
  }); // false (age should not be defined)
```

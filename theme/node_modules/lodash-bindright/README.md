# lodash-bindright
[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]

> Like lodash.bind and .bindKey, but arguments to the right

By default, almost all `.bind` methods, whether the native `Function.prototype.bind` or lodash's `_.bind` and `_.bindKey`, allow you to pass arguments to the bound function, but when the function executes, the arguments you passed to `bind` are the starting arguments.

What this does is allow you to pass arguments to `_.bind` and `_.bindKey`, and when the function executes, they will be added after whatever arguments are passed at execution time.

Here's an example comparing them:

```js
function log(msg, level) {
	console.log(msg, level);
}

// Regular bind
var logBind = _.bind(log, obj, 'info');

// bindRight
var logBindRight = _.bindRight(log, obj, 'info');

logBind('something');
//=> info something

logBindRight('something');
//=> something info
```

Why is this useful? Mainly for when you want your function to be able to accept optional arguments.

A common use case I had for it was when I wanted to use a function as an event listener, but in some cases pre-define the optional argument. Like so:

```js
var toggle = function(event, state) {
	state = state || 'open';
	$(event.currentTarget).addClass(state);
}

var close = _.bindRight(obj, toggle, 'close');

$('#foo').on('click', close);
$('#bar').on('click', toggle);
```

When `#foo` is clicked, the `state` will be set as `close`, but when `#bar` is clicked, it will default to `open`.
This is somewhat contrived, but it came up more often than using bind with the predefined arguments at the front.

## Install

```
$ npm install --save lodash-bindright
```


## Usage

```js
var _ = require('lodash-bindright')();

// or, providing your own lodash object
var _ = require('lodash-bindright')(require('lodash'));

var myObj = {
	log: function() {
		console.log(this, arguments);
	}
};

var someOtherObj = {};

var logFn = _.bindRight(myObj.log, someOtherObj, 'hello', 'world');

logFn('test');
//=> someOtherObj, ['test', 'hello', 'world']

var logFn = _.bindKeyRight(myObj, 'log', 'hello', 'world');

logFn('test');
//=> myObj, ['test', 'hello', 'world']
```


## API

### _.bindRight(fn, context, [args])
This method takes the same arguments as [_.bind](https://lodash.com/docs#bind)

### _.bindKeyRight(context, key, [args])
This method takes the same arguments as [_.bind](https://lodash.com/docs#bindKey)

## License

MIT © [Nate Cavanaugh](http://alterform.com)

[npm-image]: https://img.shields.io/npm/v/lodash-bindright.svg?style=flat-square
[npm-url]: https://npmjs.org/package/lodash-bindright
[travis-image]: https://img.shields.io/travis/natecavanaugh/lodash-bindright/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/natecavanaugh/lodash-bindright
[coveralls-image]: https://img.shields.io/coveralls/natecavanaugh/lodash-bindright/master.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/natecavanaugh/lodash-bindright?branch=master
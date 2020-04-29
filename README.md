# worker-function

Create functions that are executed inside of web workers and return promises.

Allows to create inline web workers without the need of creating new files for them. Have a look at the example:

```js
const WorkerFunction = require('worker-function');

// Let's create a new worker
var workerSum = WorkerFunction( function( arg1, arg2, done ){
  // Worker execution can be async,
  // don't forget to call `done`
  setTimeout( () => done( arg1 + arg2 ), 2000 );
});

// workerSum is used in a new thread
// and return a promise with the result
workerSum(2, 3).then( result => {
  console.log( result ); // 5
});
```
[See it working in a JSBin](https://jsbin.com/geqohac/edit?js,console).

`worker-function` reinforce the usage of web workers as disposable resources. In the example, everytime `workerSum` is called, a new web worker is created to execute the function in its own thread. When the function `done` is called the web worker is terminated freeing memory.

The library is really lightweight, less than 1Kb minified.

## Installation
```
npm install worker-function
```

Or you can use [WorkerFunction.js](https://github.com/arqex/worker-function/blob/master/WorkerFunction.js) directly in the browser.

## usage
Functions to be executed in a web worker are created by passing them to the `WorkerFunction`:

```js
var workerFn = WorkerFunction( function Fn(arg1,arg2,...,argN,done){
  // Calling done will resolve the promise with the result given
  done( 'Hey there' );
});
```

Now it's possible to call `workerFn` in the usual way, but it will be executed in its own thread, within a web worker. The execution will be isolated from the main browser thread so you can't use any of the variables defined outside of the function.

It's possible to pass any number of arguments needed to a worker function. In addition, `done` function is always passed as the last argument, and **it's mandatory to call it to send the result from the main thread**, resolving the promise and terminating the worker:

```js
workerFn(arg1, arg2, ..., argN)
  .then( result => {
    console.log( result ); // 'Hey there'
  })
  .catch( err => {
    // Any error inside the worker execution can
    // be catched using the Promise's catch method
    console.error( err );
  })
;
```

## Debugging
You can use your browser's dev tools to debug your worker functions. Try to add `debugger` to your function and the debugger will stop there:

```js
var wf = WorkerFunction( done => {
  debugger;
  done('This function was stopped in the previous line.');
});
```

## Compatibility
Most of modern browsers support web workers, [see compatibility list](https://caniuse.com/#feat=webworkers).

But in case we need to run the code in browsers that don't support them, or in Node environments where web workers are not available, `worker-function` falls back running the functions in the main thread, so we can use the library with no compromise.

The only requirement of `worker-function` to work is to have `Promise`s available. So if we need our code to be compatible with old browers, we need to get sure we [polyfill promises](https://github.com/taylorhakes/promise-polyfill).


## Performance
`worker-function` treat web workers as disposable resources, so there is some time spent when we start a worker up.

Fortunatelly, that startup time is almost unperceivable in the modern browsers. In our benchmarks, running a worker-function scores almost exactly the same than running the function in the body of the `Promise.resolve` method:

```
Chrome 81
---
Worker function x 67.73 ops/sec ±2.81% (56 runs sampled)
Promise function x 68.78 ops/sec ±2.36% (50 runs sampled)

Firefox 75
---
Worker function x 182 ops/sec ±2.11% (54 runs sampled)
Promise function x 182 ops/sec ±2.43% (55 runs sampled)

Safari 13
---
Worker function x 307 ops/sec ±1.61% (57 runs sampled)
Promise function x 318 ops/sec ±1.29% (59 runs sampled)
```

These benchmarks are available for anyone to run at [test.html](https://github.com/arqex/worker-function/blob/master/test.html).


## License
[Mit](LICENSE) © Javier Marquez

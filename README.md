# worker-function
Create functions that are executed inside of a webworker and return promises.

Allows to create inline web workers without the need of creating single files for them. Have a look at the example:

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
[See it working in a JSBin](http://jsbin.com/woyemipavi/edit?js,console).

`worker-function` reinforce the usage of web workers as disposable resources. In the example, everytime `workerSum` is called, a new web worker is created to execute the function in its own thread. When the function `done` is called the web worker is terminated freeing memory.

The library is really lightweight, less than 1Kb minified.

## Installation
```
npm install worker-function
```

Or you can use in the browser directly from the [dist files](https://github.com/arqex/worker-function/tree/master/dist).

## usage
Worker functions are created by passing them to the `WorkerFunction` function:

```js
var workerFn = WorkerFunction( function Fn(arg1,arg2,...,argN,done){
  // Calling done will resolve the promise with the result given
  done( 'Hey there' );
});
```

You can pass as many arguments as needed to the function that is going to be executed within the web worker. You must know that the worker function will be called in its own thread, isolated from the main browser thread so you can't use any of the variables defined outside of the function.

A `done` function is always passed as the last argument to the function, and it's mandatory to call it to get the result from the main thread, using `then`:

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

## License
[Mit](LICENSE) © Javier Marquez

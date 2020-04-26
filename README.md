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
[See it working in a JSBin](http://jsbin.com/woyemipavi/edit?js,console).

`worker-function` reinforce the usage of web workers as disposable resources. In the example, everytime `workerSum` is called, a new web worker is created to execute the function in its own thread. When the function `done` is called the web worker is terminated freeing memory.

The library is really lightweight, less than 1Kb minified.

## Installation
```
npm install worker-function
```

Or you can use it in the browser directly from the [dist files](https://github.com/arqex/worker-function/tree/master/dist).

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

## License
[Mit](LICENSE) © Javier Marquez

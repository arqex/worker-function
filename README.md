# worker-function
Create functions that are executed inside of a webworker and return promises.

Allows to create inline web workers without the need of creating single files for them. Have a look at the example:

```js
const Wf = require('worker-function');

// Let's create a new worker
var workerSum = new Wf( function( arg1, arg2, done ){
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

Everytime `workerSum` is called, a new web worker is created to execute the funcion in its own thread. When the function `done` is called the web worker is terminated freeing memory.

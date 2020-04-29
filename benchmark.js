const Benchmark = require('benchmark');
const WorkerFunction = require('./WorkerFunction');

function iterate() {
  var sum;
  for (var i = 0; i < 100000; i++) {
    sum++;
  }
  return sum;
}

var wf = WorkerFunction(function (done) {
  done(iterate());
});

var pf = function () {
  return Promise.resolve(iterate());
}

var suite = new Benchmark.Suite();
suite
  .add('Worker function', {
    defer: true,
    fn: deferred => {
      wf().then(() => deferred.resolve());
    }
  })
  .add('Promise function', {
    defer: true,
    fn: deferred => {
      wf().then(() => deferred.resolve());
    }
  })
  .add('Direct call', () => {
    iterate();
  })
  .on('cycle', function (event) {
    console.log(String(event.target));
  })
  .on('complete', function () {
    //console.log( this );
  })
  .run({defer: true})
;



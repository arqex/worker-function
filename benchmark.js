function iterate(){
  var sum;
  for(var i = 0; i<100000; i++ ){
    sum++;
  }
  return sum;
}

var wf = WorkerFunction( function(done) {
  done( iterate() );
});

var pf = function() {
  return Promise.resolve( iterate() );
}
(function( glob ) {
  var WORKER_ENABLED = areWorkersAvailable();

  var wrapper = function(){
    // user function already defined as uf
    var done = function( result ){
      self.postMessage( result );
      self.close();
    }
  
    self.onmessage = function( msg ){
      var args = msg.data.slice();
      args.push( done );
      uf.apply(self, args);
    };
  }
  
  var WorkerFunction;
  if( WORKER_ENABLED ){
    WorkerFunction = function(fn) {
      return function WorkedFunction(){
        var args = Array.prototype.slice.call( arguments, 0 );
    
        return new Promise( function( resolve, reject ){
          var fnSrc = 'var uf = ' + fn.toString() + ';\n';
          var wSrc = 'var w = ' + wrapper.toString() + ';\n' + 'w();';
          var worker = new SrcWorker( fnSrc + wSrc );
    
          worker.onmessage = function( result ){
            resolve( result.data );
          };
          worker.onerror = function( err ){
            reject( err );
          }
    
          worker.postMessage( args );
        });
      }
    }
  }
  else {
    console.warn('worker-function: BROWSER NOT SUPPORTED - falling back to non-worker methods')
    WorkerFunction = function(fn) {
      return function NonWorkedFunction() {
        var args = Array.prototype.slice.call(arguments, 0);
  
        return new Promise(function (resolve, reject) {
          try {
            args.push(resolve);
            fn.apply(self, args);
          }
          catch (e) {
            reject(re);
          }
        });
      }
    }
  }
  
  function areWorkersAvailable(){
    var available = !!(typeof window !== 'undefined' && window.URL && window.Blob && window.Worker);
    if( available ){
      // One more test
      try {
        var worker = new SrcWorker('');
        worker.terminate();
      }
      catch( err ){
        return false;
      }
    }
    return available;
  }
  
  function SrcWorker( src ){
    return new window.Worker( window.URL.createObjectURL(
      new window.Blob([ src ], { type: "text/javascript" })
    ));
  }
  
  if( typeof module !== 'undefined' ){
    module.exports = WorkerFunction;
  }
  else if (glob ){
    glob.WorkerFunction = WorkerFunction;
  }
})(this);


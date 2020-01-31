var WORKER_ENABLED = !!(typeof window !== 'undefined' && window.URL && window.Blob && window.Worker);

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

function WorkerFunction( fn ){
  if (!WORKER_ENABLED) {
    // Older browsers will run the function in the main thread.
    return function () {
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

  return function(){
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

function SrcWorker( src ){
  return new window.Worker(window.URL.createObjectURL(
    new window.Blob([ src ], { type: "text/javascript" })
  ));
}

if(typeof module !== 'undefined')
  module.exports = WorkerFunction;

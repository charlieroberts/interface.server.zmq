// This requires starting interface.server running an application that sends 0MQ messages to port 10080.

var zmq = require( 'zmq' ),
    sock = zmq.socket( 'pull' );

sock.connect( 'tcp://127.0.0.1:10080' )
console.log( '0MQ connected using TCP on port 10080' )

sock.on( 'message', function( msg ){
  console.log( '%s', msg.toString() )
})
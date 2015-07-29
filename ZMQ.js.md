ZeroMQ
======
By default, IS2 opens a 0MQ push service on port 10080. Applications can configure services to be opened on other ports
as they see fit. Messages sent from IS2 to clients come in as JSON strings in the form of
{ path:'/some/path/to/somewhere', values:[ 0,1,"stringy" ] }. You can test basic 0MQ functionality by running IS2 and then 
running the zeroMQ_test.js file found in the *tests* directory using node.

    !function( IS ) {
      
    var EE = require( 'events' ).EventEmitter,
        zmq = require( 'zmq' ),
		
    ZMQ = {
      app: null,
      //port: IS.config.transports.zmq.port,
      //ip: 'tcp://127.0.0.1',
      clients: {},
      
      servers:{},
      
      init: function( app ) {
        this.__proto__ = new EE()
        this.__proto__.setMaxListeners( 0 )
        
        this.on( 'ZeroMQ server created', function( server, port ) {
          ZMQ.servers[ port ] = server 
        })
      },

*createServer* creates a new 0MQ push server to the provided port / ip address. Triggers the 'ZeroMQ server created' event.

      createServer : function( ip, port ) {
        if( this.servers[ port ] ) return this.servers[ port ]
        
        var server = zmq.socket( 'push' )
              
        server.bindSync( 'tcp://' + ip + ':' + port );
        
        server.clients = {}
        
        server.output = function( path, typetags, values ) {
          this.send( JSON.stringify({ 'key': path, 'values':values }) )
        }
        
        ZMQ.servers[ port ] = server
        
        this.emit( 'ZeroMQ server created', server, port )
        
        return server
      },
    }
    
    module.exports = function( __IS ) { if( typeof IS === 'undefined' ) { IS = __IS; } ZMQ.app = IS; return ZMQ; }
    
    }()
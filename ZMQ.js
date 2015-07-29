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
'use strict';

var util          = require( 'util' );
var Rabbus        = require( 'rabbus' );
var mixins        = require( '../util/mixins' );
var validate      = require( './validate' );
var requestStatus = require( './status' );
var config        = require( '../config' );
var logger        = require( '../logger' );
/*
	Responder
	@params options
		exchange
		queue
		autoDelete
		routingKey
		limit
		noBatch
 */
function Responder ( options ) {

	var data = mixins.getConsumerOptions( options, 'req-res' );
	if ( data instanceof Error ) {
		throw data;
	}

	Rabbus.Responder.call( this, config.rabbit, data );
	// validations
	this.vSchema      = options.validate;
	this.vOptions     = options.validateOptions;

	this.logger = logger( { 'emitter' : this } );
}

util.inherits( Responder, Rabbus.Responder );

// Instance Methods
// ----------------
Responder.prototype.consume = function ( callback ) {

	var that = this;

	this.handle( function ( message, respond ) {

		var statusOptions = {
			'log'         : that.logger,
			'messageType' : that.messageType,
			'respond'     : respond,
			'message'     : message,
			'emitter'     : that
		};

		if (  !that.vSchema || that.vSchema === 'undefined' ) {
			// if no validation, invoke callback immediately
			callback( message, requestStatus( statusOptions ) );
		} else {

			// perform validation if there is a validation schema
			validate( {
				'value'   : message,
				'schema'  : that.vSchema,
				'options' : that.vOptions
			} )
			.then( function ( data ) {
				callback( data, requestStatus( statusOptions ) );
			} )
			.catch( function ( error ) {
				// send fail
				respond( {
					'status' : 'fail',
					'data'   : error.message
				} );
			} );
		}

	} );

	return this;
};

module.exports = Responder;

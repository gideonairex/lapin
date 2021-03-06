'use strict';

/* jshint expr: true */
/* eslint no-unused-expressions:0 */

var requireNew = require( 'require-new' );
var expect     = require( 'chai' ).expect;

describe( 'Perform publish subscribe multiple messageTypes', function () {

	var lapin;
	var rabbit = requireNew( 'wascally' );
	var Lapin  = requireNew( process.cwd() );

	before( function ( done ) {
		require( '../init' )( {
			'done'   : done,
			'rabbit' : rabbit
		} );
		lapin = new Lapin( rabbit );
	} );

	describe( 'WITH payload', function () {
		var published;
		var payload   = { 'user' : 'Testfoo' };
		var errorData = null;

		before( function ( done ) {

			lapin.subscribe( {
				'messageType' : [ 'v1.pubtestmul.get', 'v1.testpubmul.get' ]
			}, function ( data ) {
				published = data;
			} )
				.on( 'error', done )
				.on( 'ready', function ( subscriber ) {
					var messageType = 'v1.pubtestmul.get';
					if ( subscriber.messageType.slice( 8 ) === messageType ) {
						lapin.publish( 'v1.pubtestmul.get', payload, function ( error ) {
							errorData = error;
							setTimeout( done, 1000 );
						} );
					}
				} );
		} );

		it( '-- should SUBSCRIBED correct data', function () {
			expect( published ).be.an( 'object' );
			expect( published.user ).to.equal( 'Testfoo' );
			expect( errorData ).to.not.exist;
		} );
	} );
} );


'use strict';

var expect   = require( 'chai' ).expect;
var sinon    = require( 'sinon' );
var Receiver = require( process.cwd() + '/lib/send-rec/receiver' );

describe( 'Receiver', function () {

	var Lapin;
	var consumerStub;

	before( function () {
		Lapin = new Receiver( { 'messageType' : 'v1.consumer.verify' } );
	} );

	describe( 'receive', function () {

		before( function () {
			consumerStub = sinon.stub( Lapin, 'receive', consumerStub );
			Lapin.consume( sinon.spy() );
		} );

		after( function () {
			consumerStub.restore();
		} );

		it( 'should call cosumer only once', function () {
			expect( consumerStub.calledOnce ).to.equal( true );
		} );

	} );

} );

'use strict';

/* jshint expr: true */
/* eslint no-unused-expressions:0 */

var expect     = require( 'chai' ).expect;
var sinon      = require( 'sinon' );
var proxyquire = require( 'proxyquire' );

describe( 'requester and responder', function () {

	describe( 'requester', function () {

		var RabbusStub = {
			'Requester' : function () {}
		};

		var callbackSpy;
		var Lapin;
		var ReqRes;
		var requestSpy;

		var messageTest = { 'foo' : 'bar' };

		var replies = {
			'success' : {
				'status' : 'success',
				'data'   : { 'data' : 'success' }
			},

			'error' : {
				'status'  : 'error',
				'message' : 'Internal Error',
				'data'    : { 'data' : 'error data' }
			},

			'fail' : {
				'status' : 'fail',
				'data'   : { 'data' : 'fail' }
			}
		};

		describe( 'success request', function () {

			before( function ( done ) {
				RabbusStub.Requester.prototype.once           = function () {};
				RabbusStub.Requester.prototype.removeListener = function () {};
				RabbusStub.Requester.prototype.request        = function ( message, reply ) {
					// return a successful reply
					reply( replies.success );
				};

				ReqRes = proxyquire( process.cwd() + '/lib/req-res.js', {
					'rabbus' : RabbusStub
				} );

				callbackSpy = sinon.spy();
				requestSpy  = sinon.spy( RabbusStub.Requester.prototype, 'request' );
				Lapin       = new ReqRes( {} );

				Lapin.request( 'v1.test.create', messageTest, callbackSpy );

				done();
			} );

			after( function ( done ) {
				callbackSpy = undefined;
				Lapin       = undefined;
				ReqRes      = undefined;
				requestSpy  = undefined;

				done();
			} );

			it( 'should should call Rabbus with correct message', function ( done ) {
				expect( requestSpy.calledWith( messageTest ) ).to.equal( true );

				done();
			} );

			it( 'should call callback without error', function ( done ) {
				expect( callbackSpy.calledOnce ).to.equal( true );
				expect( callbackSpy.calledWith( null, replies.success ) ).to.equal( true );

				done();
			} );

		} );

		describe( 'error request', function () {

			before( function ( done ) {
				RabbusStub.Requester.prototype.request = function ( message, reply ) {
					// return a reply with an error
					reply( replies.error );
				};

				ReqRes = proxyquire( process.cwd() + '/lib/req-res.js', {
					'rabbus' : RabbusStub
				} );

				callbackSpy = sinon.spy();
				requestSpy  = sinon.spy( RabbusStub.Requester.prototype, 'request' );
				Lapin       = new ReqRes( {} );

				Lapin.request( 'v1.test.create', messageTest, callbackSpy );

				done();
			} );

			after( function ( done ) {
				callbackSpy = undefined;
				Lapin       = undefined;
				ReqRes      = undefined;
				requestSpy  = undefined;

				done();
			} );

			it( 'should should call Rabbus with correct message', function ( done ) {
				expect( requestSpy.calledWith( messageTest ) ).to.equal( true );

				done();
			} );

			it( 'should call callbackSpy with error', function ( done ) {
				expect( callbackSpy.calledOnce ).to.equal( true );
				expect( callbackSpy.calledWith( replies.error, null ) ).to.equal( true );

				done();
			} );

		} );

		describe( 'fail request', function () {

			before( function ( done ) {
				RabbusStub.Requester.prototype.request = function ( message, reply ) {
					// return a reply with an fail
					reply( replies.fail );
				};

				ReqRes = proxyquire( process.cwd() + '/lib/req-res.js', {
					'rabbus' : RabbusStub
				} );

				callbackSpy = sinon.spy();
				requestSpy  = sinon.spy( RabbusStub.Requester.prototype, 'request' );
				Lapin       = new ReqRes( {} );

				Lapin.request( 'v1.test.create', messageTest, callbackSpy );

				done();
			} );

			after( function ( done ) {
				callbackSpy = undefined;
				Lapin       = undefined;
				ReqRes      = undefined;
				requestSpy  = undefined;

				done();
			} );

			it( 'should should call Rabbus with correct message', function ( done ) {
				expect( requestSpy.calledWith( messageTest ) ).to.equal( true );

				done();
			} );

			it( 'should call callback with a fail error', function ( done ) {
				expect( callbackSpy.calledOnce ).to.equal( true );
				expect( callbackSpy.calledWith( replies.fail, null ) ).to.equal( true );

				done();
			} );

		} );

	} );

	describe( 'responder', function () {

		var RabbusStub = {
			'Responder' : function () {}
		};

		var callbackSpy;
		var Lapin;
		var ReqRes;

		describe( 'response', function () {

			before( function ( done ) {

				callbackSpy = sinon.spy();

				RabbusStub.Responder.prototype.handle = function ( callback ) {
					// execute the callback
					callback();
				};

				ReqRes = proxyquire( process.cwd() + '/lib/req-res.js', {
					'rabbus' : RabbusStub
				} );

				Lapin       = new ReqRes( {} );

				Lapin.respond( 'v1.test.create', callbackSpy );

				done();
			} );

			after( function ( done ) {
				callbackSpy = undefined;
				Lapin       = undefined;
				ReqRes      = undefined;

				done();
			} );

			it( 'should call callback only once', function ( done ) {
				expect( callbackSpy.calledOnce ).to.equal( true );

				done();
			} );

		} );

	} );

} );
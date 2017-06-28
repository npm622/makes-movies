var express = require( 'express' ),
  app = express(),
  bodyParser = require( 'body-parser' ),
  engines = require( 'consolidate' ),
  MongoClient = require( 'mongodb' ).MongoClient,
  assert = require( 'assert' );

MongoClient.connect( 'mongodb://localhost:27017/video', function( err, db ) {
  assert.equal( null, err );

  app.engine( 'html', engines.nunjucks );
  app.set( 'view engine', 'html' );
  app.set( 'views', __dirname + '/views' );
  app.use( bodyParser.urlencoded( {
    extended: true
  } ) );

  function errorHandler( err, req, res, next ) {
    res.status( 500 ).render( 'error', {
      error: err
    } );
  }

  app.get( '/', function( req, res ) {
    res.redirect( '/movies' );
  } );

  app.get( '/movies', function( req, res ) {
    // TODO: read query params for filters...

    db.collection( 'movies' ).find( {} ).toArray( function( err, docs ) {
      res.render( 'read', {
        'movies': docs
      } );
    } );
  } );

  app.post( '/movies', function( req, res, next ) {
    var movie = req.body;

    if ( typeof movie === 'undefined' ) {
      next( Error( 'Please include movie details before saving!' ) );
    } else {
      db.collection( 'movies' ).insertOne( movie, function( err, doc ) {
        res.redirect( '/movies' );
      } );
    }
  } );

  app.use( errorHandler );

  var server = app.listen( 3000, function() {} );
} );

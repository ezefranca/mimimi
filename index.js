var express = require('express');
var app = express();

// set the view engine to ejs
app.set('view engine', 'ejs');
app.use(express.static('public'));

var server_port = 80;
var ObjectId = require('mongojs').ObjectId; 

// default to a 'localhost' configuration:
var connection_string = '127.0.0.1:27017/mimimi';

var mongojs = require('mongojs');

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({extended: true})); // support encoded bodies

var watson = require('watson-developer-cloud');

var db = mongojs(connection_string, ['mimimi']);
var mimimi = db.collection('mimimi');
var chupeta = db.collection('chupeta');

app.get('/', function (req, res) {
    'use strict';
});

app.get('/mimimi', function (req, res) {
    'use strict';
    mimimi.find( ).sort( {_id:-1} ).limit(10).toArray( function ( err, result ) {
        for
        res.status(200).send( result );
    } );
});

app.post('/mimimi', function (req, res) {
    'use strict';
    console.log( req.body.text );
    var natural_language_classifier = watson.natural_language_classifier({
        url: 'https://gateway.watsonplatform.net/natural-language-classifier/api',
        username: '29ca2729-99f2-44c8-aa34-cec2d0ec0547',
        password: 'RIaSGR9oLleh',
        version: 'v1'
    });

    natural_language_classifier.classify(
        {
            text: req.body.text,
            classifier_id: 'f15e67x54-nlc-4983'
        },
        function (err, response) {
            if (err) {
                res.status(403).send(err);
            } else {
                if( response.classes[ 0 ].confidence > 0.5 ) {
                    console.log( response.classes[ 0 ].confidence );
                    chupeta.find( { "term": response.classes[ 0 ].class_name } ).toArray( function ( err, result ) {
                        console.log( result );
                        if ( result.length ) {
                            var r = Math.floor(Math.random()*result.length);
                            res.status(200).send( {
                                id: result[ r ]._id,
                                text: result[ r ].text,
                                like: result[ r ].like,
                                haha: result[ r ].haha
                            } );
                        }
                        else {
                            chupeta.find( { "term": '404' } ).toArray( function ( err, result ) {
                                var r = Math.floor(Math.random()*result.length);
                                res.status(200).send( {
                                    id: result[ r ]._id,
                                    text: result[ r ].text,
                                    like: result[ r ].like,
                                    haha: result[ r ].haha
                                } );
                            } );
                        }
                    } );
                }
                else {
                    console.log( "Estou indeciso" );
                    chupeta.find( { "term": '404' } ).toArray( function ( err, result ) {
                        console.log( result );
                        var r = Math.floor(Math.random()*result.length);
                        res.status(200).send( {
                            id: result[ r ]._id,
                            text: result[ r ].text,
                            like: result[ r ].like,
                            haha: result[ r ].haha
                        } );
                    } );
                }
                mimimi.insert( { text: req.body.text, comments: [], classification: response.classes, commentsCount:0, like:0, meh:0, haha:0 } );
            }
        }
    );
});

app.post('/classify', function (req, res) {
    'use strict';
    var natural_language_classifier = watson.natural_language_classifier({
        url: 'https://gateway.watsonplatform.net/natural-language-classifier/api',
        username: '29ca2729-99f2-44c8-aa34-cec2d0ec0547',
        password: 'RIaSGR9oLleh',
        version: 'v1'
    });

    natural_language_classifier.classify(
        {
            text: req.body.text,
            classifier_id: 'f15e67x54-nlc-4983'
        },
        function (err, response) {
            if (err) {
                res.status(403).send(err);
            } else {
                res.status(200).send(response);
            }
        }
    );
});

app.post( '/mimimi/comment/:id', function (req, res) {
    'use strict';
    mimimi.find( { "_id": ObjectId( req.params.id ) } ).toArray( function ( err, result ) {
        if ( result ) {
            console.log( 'new chupeta' );
            console.log( req.body.comment );
            mimimi.update( { "_id": ObjectId( result._id ) }, { $set: { 'commentsCount': parseInt( result.commentsCount, 10 ) + 1 } } );
            chupeta.insert( { "term": result.term, "text": req.body.comment }, function ( err, docsInserted ) {
                mimimi.update( { "_id": ObjectId( result._id ) }, { $push: { 'comment': docsInserted._id } } );
            } );
        }
    } );
    res.status(200).send();
});

app.post( '/mimimi/like/:id', function (req, res) {
    'use strict';
    mimimi.find( { "_id": ObjectId( req.params.id ) } ).toArray( function ( err, result ) {
        if ( result ) {
            result = result[ 0 ];
            mimimi.update( { "_id": ObjectId( result._id ) }, { $set: { 'like': parseInt( result.like, 10 ) + 1 } } );
        }
    } );
    res.status(200).send();
});

app.post( '/mimimi/remove-like/:id', function (req, res) {
    'use strict';
    mimimi.find( { "_id": ObjectId( req.params.id ) } ).toArray( function ( err, result ) {
        if ( result ) {
            result = result[ 0 ];
            mimimi.update( { "_id": ObjectId( result._id ) }, { $set: { 'like': parseInt( result.like, 10 ) - 1 } } );
        }
    } );
    res.status(200).send();
});

app.post( '/chupeta/like/:id', function (req, res) {
    'use strict';
    chupeta.find( { "_id": ObjectId( req.params.id ) } ).toArray( function ( err, result ) {
        if ( result ) {
            result = result[ 0 ];
            chupeta.update( { "_id": ObjectId( result._id ) }, { $set: { 'like': parseInt( result.like, 10 ) + 1 } } );
        }
    } );
    res.status(200).send();
});

app.post( '/chupeta/remove-like/:id', function (req, res) {
    'use strict';
    chupeta.find( { "_id": ObjectId( req.params.id ) } ).toArray( function ( err, result ) {
        if ( result ) {
            result = result[ 0 ];
            mimimi.update( { "_id": ObjectId( result._id ) }, { $set: { 'like': parseInt( result.like, 10 ) + 1 } } );
        }
    } );
    res.status(200).send();
});

app.post( '/mimimi/haha/:id', function (req, res) {
    'use strict';
    mimimi.find( { "_id": ObjectId( req.params.id ) } ).toArray( function ( err, result ) {
        if ( result ) {
            result = result[ 0 ];
            mimimi.update( { "_id": ObjectId( result._id ) }, { $set: { 'haha': parseInt( result.haha, 10 ) + 1 } } );
        }
    } );
    res.status(200).send();
});

app.post( '/mimimi/remove-haha/:id', function (req, res) {
    'use strict';
    mimimi.find( { "_id": ObjectId( req.params.id ) } ).toArray( function ( err, result ) {
        if ( result ) {
            result = result[ 0 ];
            mimimi.update( { "_id": ObjectId( result._id ) }, { $set: { 'haha': parseInt( result.haha, 10 ) - 1 } } );
        }
    } );
    res.status(200).send();
});

app.post( '/chupeta/haha/:id', function (req, res) {
    'use strict';
    chupeta.find( { "_id": ObjectId( req.params.id ) } ).toArray( function ( err, result ) {
        if ( result ) {
            result = result[ 0 ];
            chupeta.update( { "_id": ObjectId( result._id ) }, { $set: { 'haha': parseInt( result.haha, 10 ) + 1 } } );
        }
    } );
    res.status(200).send();
});

app.post( '/chupeta/remove-haha/:id', function (req, res) {
    'use strict';
    chupeta.find( { "_id": ObjectId( req.params.id ) } ).toArray( function ( err, result ) {
        if ( result ) {
            result = result[ 0 ];
            mimimi.update( { "_id": ObjectId( result._id ) }, { $set: { 'haha': parseInt( result.haha, 10 ) + 1 } } );
        }
    } );
    res.status(200).send();
});

app.post( '/mimimi/meh/:id', function (req, res) {
    'use strict';
    mimimi.find( { "_id": ObjectId( req.params.id ) } ).toArray( function ( err, result ) {
        if ( result ) {
            result = result[ 0 ];
            mimimi.update( { "_id": ObjectId( result._id ) }, { $set: { 'meh': parseInt( result.meh, 10 ) + 1 } } );
        }
    } );
    res.status(200).send();
});

app.post( '/mimimi/remove-meh/:id', function (req, res) {
    'use strict';
    mimimi.find( { "_id": ObjectId( req.params.id ) } ).toArray( function ( err, result ) {
        if ( result ) {
            result = result[ 0 ];
            mimimi.update( { "_id": ObjectId( result._id ) }, { $set: { 'meh': parseInt( result.meh, 10 ) - 1 } } );
        }
    } );
    res.status(200).send();
});

app.post( '/chupeta/meh/:id', function (req, res) {
    'use strict';
    chupeta.find( { "_id": ObjectId( req.params.id ) } ).toArray( function ( err, result ) {
        if ( result ) {
            result = result[ 0 ];
            chupeta.update( { "_id": ObjectId( result._id ) }, { $set: { 'meh': parseInt( result.meh, 10 ) + 1 } } );
        }
    } );
    res.status(200).send();
});

app.post( '/chupeta/remove-meh/:id', function (req, res) {
    'use strict';
    chupeta.find( { "_id": ObjectId( req.params.id ) } ).toArray( function ( err, result ) {
        if ( result ) {
            result = result[ 0 ];
            mimimi.update( { "_id": ObjectId( result._id ) }, { $set: { 'meh': parseInt( result.meh, 10 ) - 1 } } );
        }
    } );
    res.status(200).send();
});

app.get('/check', function (req, res) {
    'use strict';
    res.status(200);
    mimimi.find({}).toArray( function( err, docs ) {
        res.send(docs);
    } );
});

app.get('/health', function (req, res) {
    'use strict';
    res.status(200).send();
});

app.listen(server_port, function () {
    'use strict';
    console.log('Example app listening on port 80');
});

// Set up
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var cors = require('cors');

// Configuration
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/dKomp");

app.use(bodyParser.urlencoded({'extended': 'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({type: 'application/vnd.api+json'}));
app.use(methodOverride());
app.use(cors());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'DELETE, POST, PUT');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Model
var Words = mongoose.model('Words', {
    userName: String,
    keywords: [{type: String}]
});

// Get all associated ids with keywords 
app.get('/api/dKomp', function (req, res) {

    console.log("Listing ids with keywords...");

    //use mongoose to get all keywords in the database
    Words.find(function (err, dKomp) {

        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err) {
            res.send(err);
        }

        res.json(dKomp); // return all groceries in JSON format
    });
});

// Get one row
app.get('/api/dKomp/:id', function (req, res) {

    console.log("Listing dKomp item...");

    //use mongoose to get all groceries in the database
    Words.find({_id: req.params.id}, function (err, dKomp) {

        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err) {
            res.send(err);
        }

        res.json(dKomp); // return all rows in JSON format
    });
});

// Create a row with an id
app.post('/api/dKomp', function (req, res) {

    console.log("Creating dKomp row...");

    Words.create({
        userName: req.body.userName,
        keywords: req.body.keywords,
        done: false
    }, function (err, dKomp) {
        if (err) {
            res.send(err);
        }

        // create and return all the rows
        Words.find(function (err, dKomp) {
            if (err)
                res.send(err);
            res.json(dKomp);
        });
    });

});

// Update an Item
app.put('/api/dKomp/:id', function (req, res) {
    const row = {
        userName: req.body.userName,
        keywords: req.body.keywords
    };
    console.log("Updating item - ", req.params.id);
    Words.update({_id: req.params.id}, row, function (err, raw) {
        if (err) {
            res.send(err);
        }
        res.send(raw);
    });
});


// Delete a dKomp Item
app.delete('/api/dKomp/:id', function (req, res) {
    Words.remove({
        _id: req.params.id
    }, function (err, dKomp) {
        if (err) {
            console.error("Error deleting ", err);
        }
        else {
            Words.find(function (err, dKomp) {
                if (err) {
                    res.send(err);
                }
                else {
                    res.json(dKomp);
                }
            });
        }
    });
});


// Start app and listen on port 8080  
app.listen(process.env.PORT || 8080);
console.log("dKomp server listening on port  - ", (process.env.PORT || 8080));
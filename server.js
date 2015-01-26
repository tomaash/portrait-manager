'use strict';
var mongoose = require('mongoose');
var baucis = require('baucis');
var express = require('express');
var cors = require('cors');
var gcloud = require('gcloud');
var Busboy = require('busboy');
var app = express();


// Choose database
if (app.get('env') === 'development') {
	mongoose.connect('mongodb://localhost/portrait-manager');
} else {
	mongoose.connect('mongodb://admin:1234@ds047008.mongolab.com:47008/portrait-manager');
}

// Handle uploads with Google Storage 
var storage = gcloud.storage({
	keyFilename: 'portrait-manager.json',
	projectId: 'my-project'
});

var bucket = storage.bucket('pmg');

app.post('/upload', function(req, res) {
	var busboy = new Busboy({ headers: req.headers });
	busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
		var id = req.query.personId;
		var bucketname = id + '.jpg';
		console.log("Will save to gcloud: " + bucketname);
		var writeStream = bucket.file(bucketname).createWriteStream();
		file.pipe(writeStream);
    });
    busboy.on('finish', function() {
      res.writeHead(200, { 'Connection': 'close' });
      res.end('Upload OK');
    });
    req.pipe(busboy);
});

app.get('/image', function(req, res) {
	var id = req.query.id;
	var filename = id + '.jpg';
	var file = bucket.file(filename);
	var stream = file.createReadStream();
	res.contentType('image/jpeg');
	stream.on('error', function(err) {
		res.writeHead(404, {
			'Content-Type': 'text/plain'
		});
		res.write('404 not found');
		res.end();
	});
	stream.pipe(res);
});


// Define schemas
var Person = new mongoose.Schema({
	firstName: String,
	lastName: String,
        imageId: String,
        teacher: {
          type: mongoose.Schema.ObjectId,
          ref: 'teacher'
        },
        grade: {
          type: mongoose.Schema.ObjectId,
          ref: 'grade'
        }
});

var Teacher = new mongoose.Schema({
	firstName: String,
	lastName: String,
});

var Grade = new mongoose.Schema({
	name: String
});

mongoose.model('person', Person);
mongoose.model('teacher', Teacher);
mongoose.model('grade', Grade);

// Create REST API
baucis.rest('person');
baucis.rest('teacher');
baucis.rest('grade');

// Start server
var port = process.env.PORT || 5001;
app.use(cors());
app.use('/bower_components', express.static(__dirname + '/bower_components'));
app.use('/', express.static(__dirname + '/dist'));
app.use('/api', baucis());

app.listen(port, function() {
	console.log('Express (' + app.get('env') + ') server listening on port ' + port);
});
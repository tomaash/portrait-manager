'use strict';
var mongoose = require('mongoose');
var baucis = require('baucis');
var express = require('express');
var cors = require('cors');
var gcloud = require('gcloud');
var Busboy = require('busboy');
var app = express();


if (app.get('env') === 'development') {
	mongoose.connect('mongodb://localhost/portrait-manager');
} else {
	mongoose.connect('mongodb://admin:1234@ds047008.mongolab.com:47008/portrait-manager');
}

/* google storage */

var storage = gcloud.storage({
	keyFilename: 'portrait-manager.json',
	projectId: 'my-project'
});

// console.log(storage);

var bucket = storage.bucket('pmg');

// console.log(bucket);

// bucket.file('tom.jpg').createReadStream().pipe(fs.createWriteStream('tom.jpg'));


// fs.createReadStream('tom.jpg').pipe(bucket.file('tom2.jpg').createWriteStream());

// Multer uploads


app.post('/upload', function(req, res) {
	var busboy = new Busboy({ headers: req.headers });
	console.log(busboy);
	busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
      // var saveTo = path.join(os.tmpDir(), path.basename(fieldname));
      // file.pipe(fs.createWriteStream(saveTo));
		console.log(req.query);
		console.log(filename);
		console.log(mimetype);
		var id = req.query.personId;
		console.log(id);
		var bucketname = id + '.jpg'// + file.extension;
		console.log(bucketname);
		var writeStream = bucket.file(bucketname).createWriteStream();
		file.pipe(writeStream);
		// writeStream.write(file);
		// writeStream.end();
    });
    busboy.on('finish', function() {
      res.writeHead(200, { 'Connection': 'close' });
      res.end("That's all folks!");
    });
    req.pipe(busboy);
	// var file = req.files.file;
	// var id = req.body.personId;
	// var filename = id + '.' + file.extension;
	// var writeStream = bucket.file(filename).createWriteStream();
	// writeStream.write(file.buffer);
	// writeStream.end();
	// res.status(204).end();
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

// Create a mongoose schema.
var Person = new mongoose.Schema({
	firstName: String,
	lastName: String,
	imageId: String
});
var Teacher = new mongoose.Schema({
	firstName: String,
	lastName: String,
});
var Grade = new mongoose.Schema({
	name: String
});
// Register new models with mongoose.
mongoose.model('person', Person);
mongoose.model('teacher', Teacher);
mongoose.model('grade', Grade);
// Create a simple controller.  By default these HTTP methods
// are activated: HEAD, GET, POST, PUT, DELETE
baucis.rest('person');
baucis.rest('teacher');
baucis.rest('grade');
// Create the app and listen for API requests

var port = process.env.PORT || 5000;
app.use(cors());
app.use('/bower_components', express.static(__dirname + '/bower_components'));
app.use('/', express.static(__dirname + '/dist'));

app.use('/api', baucis());

// app.use(multer({
// 	dest: './uploads/',
// 	inMemory: true,
// 	rename: function(fieldname, filename) {
// 		return filename.replace(/\W+/g, '-').toLowerCase() + Date.now();
// 	}
// }));

app.listen(port, function() {
	console.log('Express (' + app.get('env') + ') server listening on port ' + port);
});
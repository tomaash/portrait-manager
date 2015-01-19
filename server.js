var mongoose = require('mongoose');
var baucis = require('baucis');
var express = require('express');
var cors = require('cors');

mongoose.connect('mongodb://admin:1234@ds047008.mongolab.com:47008/portrait-manager');
// mongoose.connect('mongodb://localhost/portrait-manager');
// Create a mongoose schema.
var Person = new mongoose.Schema({
	name: String
});
var Teacher = new mongoose.Schema({
	name: String
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
var app = express();
var port = process.env.PORT || 5000; 
app.use(cors());
app.use('/api', baucis());
app.use('/bower_components', express.static(__dirname + '/bower_components'));
app.use('/', express.static(__dirname + '/dist'));
app.listen(port, function() {
	console.log('Express (' + app.get('env') + ') server listening on port ' + port);
});

// Announce
console.log('Booting Mineshafter Squared API');

/**
 * Module dependencies.
 */
var
    // Imports
    fs        = require('fs'),
    path      = require('path'),
    express   = require('express'),
    config    = require('config').application,
    dir       = require('config').directories;

/**
 * Basic setup.
 */
var app = express();
app.set('port', process.env.PORT || config.port);

// Setup views and static files
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.static(__dirname + '/public'));

// Setup request handling
app.use(express.bodyParser());
app.use(app.router);

/**
 * Different Modes
 */
if ('development' == app.get('env')) {
  
  console.warn('Loading in Development Mode');
  app.use(express.logger('dev'));
  app.use(express.errorHandler());
  
} else if ('production' == app.get('env')) {
  
  console.log("Loading in Production Mode");
  app.use(express.logger());
  
}

/**
 * Models setup.
 */
app.set('models', require('./models'));

/**
 * API calls.
 * This is pretty neat, turns each route group into essentially a plugin.
 * To extend the api just drop another group of routes in the routes folder, and away we go!
 */
var routes = fs.readdirSync(dir.routes);

routes.forEach(function (file) {
  var filePath = path.resolve('./', dir.routes, file);
  var route = require(filePath);
  route.init(app);
});

/**
 * Finish up and launch!
 */
app.listen(app.get('port'));
console.log('Express server listening on port ' + app.get('port'));
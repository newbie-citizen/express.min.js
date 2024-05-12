const lib = require ("lib.min.js");

function express () {
	return new express.app ();
	}

express.app = class {
	constructor () {
		this.app = express.js ();
		this.client = new express.app.client (this);
		}
	use (... arg) {
		this.app.use (... arg);
		return this;
		}
	set (... arg) {
		this.app.set (... arg);
		return this;
		}
	get (path, context) {
		this.app.get (express.path (path), context);
		return this;
		}
	post (path, context) {
		this.app.post (express.path (path), context);
		return this;
		}
	listen (host, port, context) {
		this.app.listen (port, host, context);
		return this;
		}
	export ($) {
		$.exports = this.app;
		return this;
		}
	html (dir) {
		this.app.engine ("html", function (fp, option, context) {
			lib.fs.api.readFile (fp, function (error, content) {
				if (error) context (error);
				var data = content.toString ();
				data = lib.string (data).replace (option, {exclude: ["_locals", "settings", "cache"]});
				return context (null, data);
				});
			});
		this.app.set ("views", dir);
		this.app.set ("view engine", "html");
		return this;
		}
	}

express.app.client = class {
	constructor (express) {
		this.app = (this.express = express).app;
		}
	get (path, context) {
		this.app.get (express.path (path), function (request, response, next) {
			if (request.cross.origin) if (request.client.ip) context (request, response, next);
			else response.error.cross.origin ();
			else response.error.cross.origin ();
			});
		}
	post (path, context) {
		this.app.post (express.path (path), function (request, response, next) {
			if (request.cross.origin) context (request, response, next);
			else response.error.cross.origin ();
			});
		}
	export ($) {
		$.exports = this.express;
		}
	}

express.request = function (app) {
	return function (request, response, next) {
		request.cross = {origin: false}
		request.client = {id: ""}
		request.parse_url = express.plugin.parse_url (app, request);
		request.parse_url.param = function (param) { return request.params [param]; }
		request.visitor = express.plugin.visitor (app, request);
		next ();
		}
	}

express.request.get = function (... url) { return lib.url.get (... url); }
express.request.post = function (... url) { return lib.url.post (... url); }
express.path = function (path) { return express.path.data [path] || path; }
express.path.data = {
	"favorite.ico": "/favicon.ico",
	}

express.response = function () {
	return function (request, response, next) {
		response.error = function () {}
		response.error.cross = function () {}
		response.error.cross.origin = function () { response.status (403).send ("Forbidden : Cross Origin"); }
		response.file = function (file, option, context) {
			if (file.startsWith ("/")) file = file.substr (1);
			response.sendFile (file, {root: response.folder, ... option}, function (error) {
				if (error) response.status (404).send ("Error (404) : Not Found");
				if (context) context (error);
				});
			}
		response.html = function (template, param) {
			if (arguments.length > 1) response.render (template, param);
			else response.render ("index", template);
			}
		next ();
		}
	}

express.js = require ("express");
express.body = {parser: require ("body-parser")}
express.static = express.js.static;
express.port = 3000;
express.require = function (json) { return "./" + json; }
express.context = function (context) { return context || function () {} }

express.client = function () {}
express.client.header = function (app) {
	return function (request, response, next) {
		request.client.ip = request.headers ["x-client-ip"];
		next ();
		}
	}
express.client.port = 8000;

express.cross = function () {}
express.cross.origin = function () { return express.cross.origin.api (); }
express.cross.origin.api = require ("cors");
express.cross.origin.access = function (app) {
	return function (request, response, next) {
		if (request.cross.origin) {
			var co = app ["package.json"].cross.origin;
			if (co === "*") next ();
			else if (co.includes (request.client.host.name)) next ();
			else response.error.cross.origin ();
			}
		else next ();
		}
	}
express.cross.origin.header = function (app) {
	return function (request, response, next) {
		response.setHeader ("Access-Control-Allow-Origin", "*");
		response.setHeader ("Access-Control-Allow-Credentials", true);
		response.setHeader ("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
		response.setHeader ("Access-Control-Allow-Headers", "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Client-IP");
		next ();
		}
	}

module.exports = exports = express;

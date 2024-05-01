const axios = require ("axios");

function express () {
	return new express.io ();
	}

express.io = class {
	constructor () {
		this.app = express.js ();
		}
	use (context) {
		this.app.use (context);
		}
	get (path, context) {
		this.app.get (path, context);
		}
	export ($) {
		$.exports = this.app;
		}
	}

express.request = function (app) {
	return function (request, response, next) {
		request.parse_url = express.plugin.parse_url (app, request);
		request.visitor = express.plugin.visitor (app, request);
		next ();
		}
	}

express.response = function () {
	return function (request, response, next) {
		response.error = function () {}
		response.error.co = function () { response.send ({error: "cross:origin"}); }
		next ();
		}
	}

express.js = require ("express");
express.json = function (json) { return "./" + json; }
express.plugin = function () {}
express.cross = function () {}
express.cross.origin = function () { return express.cross.origin.policy (); }
express.cross.origin.access = function (app) {
	return function (request, response, next) {
		if (request.visitor.client) {
			var co = app ["package.json"].cross.origin;
			if (co === "*") next ();
			else if (co.includes (request.visitor.url.host.name)) next ();
			else response.error.co ();
			}
		else next ();
		}
	}
express.cross.origin.policy = require ("cors");
express.context = function (context) { return context || function () {} }
express.url = function () {}
express.url.get = function (url, option = {}) { return new express.url.c (url, {method: "get", ... option}); }
express.url.post = function (url, option = {}) { return new express.url.c (url, {method: "post", ... option}); }
express.url.c = class {
	constructor (url, option = {}) {
		this.url = url;
		this.option = option;
		}
	then (context) {
		return axios ({url: this.url, method: this.option.method || "get"}).then (context).catch (express.context (this.error));
		}
	catch (context) {
		this.error = context;
		return this;
		}
	}

module.exports = exports = express;

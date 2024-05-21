/**
 * xxx
 *
 * title
 * description
 * sub description
 *
 * xxx://xxx.xxx.xxx/xxx
 */

function express () {
	return new express.app ();
	}

express.io = require ("express");
express.body = {parser: require ("body-parser")}
express.port = 3000;

express.static = function (app) {
	for (var i in app ["package.json"].static) app.use (i, express.io.static (app ["package.json"].static [i]));
	app.html (app.dir.public);
	}

var lib = require ("lib.min.js");

/**
 * xxx
 *
 * title
 * description
 * sub description
 *
 * xxx://xxx.xxx.xxx/xxx
 */

express.app = class {
	constructor () {
		this.$app = express.io ();
		this.io = new express.app.io (this);
		}
	use (... context) { this.$app.use (... context); return this; }
	set (... data) { this.$app.set (... data); return this; }
	get (path, context) { this.$app.get (express.path (path), function (request, response, next) { context (request.io, response.io, next); }); return this; }
	post (path, context) { this.$app.post (express.path (path), function (request, response, next) { context (request.io, response.io, next); }); return this; }
	listen (host, port, context) { this.$app.listen (port, host, context); return this; }
	html (dir) {
		this.$app.engine ("html", function (fp, param, context) {
			lib.fs.api.engine.readFile (fp, function (error, content) {
				if (error) return context (error);
				var data = content.toString ();
				data = data.to_replace (param, {exclude: ["_locals", "settings", "cache"]});
				return context (null, data);
				});
			});
		this.$app.set ("trust proxy", true);
		this.$app.set ("views", dir);
		this.$app.set ("view engine", "html");
		this.$app.use (function (request, response, next) {
			response.public_html = dir;
			next ();
			});
		}
	export ($) {
		$.exports = this.$app;
		return this;
		}
	}

express.app.io = class {
	constructor (express) {
		this.$app = (this.express = express).$app;
		}
	use (context) {
		this.$app.use (function (request, response, next) {
			context (request.io, response.io, next);
			});
		}
	get (path, context) {
		this.$app.get (express.path (path), function (request, response, next) {
			if (request.io ["cross-origin"] || request.io ["rest-api"]) context (request.io, response.io, next);
			else response.io.error ("cross-origin");
			});
		}
	post (path, context) {
		this.$app.post (express.path (path), function (request, response, next) {
			if (request.io ["cross-origin"] || request.io ["rest-api"]) context (request.io, response.io, next);
			else response.io.error ("cross-origin");
			});
		}
	export ($) {
		$.exports = this.express;
		}
	}

/**
 * xxx
 *
 * title
 * description
 * sub description
 *
 * xxx://xxx.xxx.xxx/xxx
 */

express.request = function (app) {
	return function (request, response, next) {
		request.io = new express.request.io (app, request, response, next);
		next ();
		}
	}

express.request.io = class {
	constructor (app, request, response, next) {
		this.app = app;
		this.express = {request, response}
		this.next = next;
		this.__construct ();
		}
	__construct () {
		var host = (this.header = this.express.request.headers) ["host"] || this.express.request.hostname;
		var url = host + this.express.request.url;
		this.url = lib.parse_url (url, {
			protocol: this.header ["x-forwarded-proto"],
			"cross-origin": this.header ["origin"],
			});
		this.path = this.url.path;
		this ["cross-origin"] = this.url ["cross-origin"];
		this.cross = {origin: {id: "", ip: "", ... this.url.cross.origin}}
		this.date = new lib.date.time ();
		this.date.timezone ("UTC");
		}
	query (key) {
		if (key) return this.express.request.query (key);
		else return this.url.query;
		}
	param (key) {
		return this.express.request.params [key];
		}
	}

/**
 * xxx
 *
 * title
 * description
 * sub description
 *
 * xxx://xxx.xxx.xxx/xxx
 */

express.response = function (app) {
	return function (request, response, next) {
		response.io = new express.response.io (app, request, response, next);
		next ();
		}
	}

express.response.io = class {
	constructor (app, request, response, next) {
		this.app = app;
		this.express = {request, response}
		this.next = next;
		this.__construct ();
		}
	__construct () {
		this.parameter = {}
		}
	header (key, value) {
		this.express.response.setHeader (key, value);
		return this;
		}
	status (status) {
		if (status === "error:found") status = 404;
		if (status === "error:forbidden") status = 403;
		this.express.response.status (status);
		return this;
		}
	send (... data) {
		this.express.response.send (... data);
		return this;
		}
	html (template, param) {
		if (typeof template === "string") this.express.response.render (template, {... this.parameter, ... param});
		else this.express.response.render ("index", {... this.parameter, ... template});
		}
	render (... render) {
		this.express.response.render (... render);
		}
	file (file, option, context) {
		if (file.startsWith ("/")) file = file.substr (1);
		this.express.response.sendFile (file, {root: this.express.response.public_html, ... option}, function (error) {
			if (error) this.express.response.status (404).send ("Error (404) Not Found : File");
			if (context) context (error);
			}.bind ({express: this.express}));
		}
	error (error) {
		if (error === "cross-origin") return this.status ("error:forbidden").send ("Error (403) Forbidden : Cross Origin");
		if (error === "app") return this.status ("error:found").send ("Error (404) Not Found : App");
		if (error === "router") return this.status ("error:found").send ("Error (404) Not Found : Router");
		}
	param (key, value) {
		if (value) this.parameter [key] = value;
		else for (var i in key) this.parameter [i] = key [i];
		return this;
		}
	}

/**
 * xxx
 *
 * title
 * description
 * sub description
 *
 * xxx://xxx.xxx.xxx/xxx
 */

express.path = function (path) {
	return express.path.data [path] || express.path.base (path);
	}

express.path.base = function (path) {
	if (path.substr (0, 1) === "/") return path;
	else return "/" + path;
	}

express.path.data = {
	"cgi-bin:info": "/cgi-bin/info",
	"cgi-bin:client": "/cgi-bin/client",
	"cgi-bin:db": "/cgi-bin/db/:collection",
	"cgi-bin:file": "/cgi-bin/file/:file",
	"manifest.json": "/manifest.json",
	"sitemap.xml": "/sitemap.xml",
	"favorite:icon": "/favicon.ico",
	"favorite.ico": "/favorite.ico",
	}

/**
 * cross origin
 *
 * title
 * description
 * sub description
 *
 * xxx://xxx.xxx.xxx/xxx
 */

express.cross = function () {}
express.cross.origin = function (app) { return express.cross.origin.api.engine (); }
express.cross.origin.api = {engine: require ("cors")}
express.cross.origin.access = function (app) {
	return function (request, response, next) {
		request ["rest-api"] = (request.header ["x-rest-api"] === "self");
		if (request.url.host.address === app ["client.json"]["rest-api"]) request.rest_api = true;
		if (request ["cross-origin"]) {
			if (request.cross.origin.ip = request.header ["x-cross-origin-ip"]) {
				var cross = {origin: app ["package.json"].cross.origin}
				if (cross.origin === "*") next ();
				else if (cross.origin.includes (request.cross.origin.base.name)) next ();
				else response.error ("cross-origin");
				}
			}
		else next ();
		}
	}

express.cross.origin.header = function (app) {
	return function (request, response, next) {
		response.header ("Access-Control-Allow-Origin", "*");
		response.header ("Access-Control-Allow-Credentials", true);
		response.header ("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
		response.header ("Access-Control-Allow-Headers", "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Cross-Origin-IP");
		next ();
		}
	}

/**
 * client
 *
 * title
 * description
 * sub description
 *
 * xxx://xxx.xxx.xxx/xxx
 */

express.client = function (app) {
	return function (request, response, next) {
		var client;
		if (request ["cross-origin"]) client = request.cross.origin.base.name;
		else client = request.url.base.name;
		for (var i in app ["client.json"].host) {
			if (lib.help.host.check (client, i)) {
				if (request.client = {identifier: client, ... app ["client.json"].host [i]}) {
					break;
					}
				}
			}
		if (request.client) {
			if (request.client.api.gateway.driver === "file:system") {
				var config = request.client.api.config [request.client.api.gateway.adapter || request.client.api.gateway.driver];
				var directory = [app.dir.client, (config.directory || request.url.base.name), "db"].join (lib.path.separator ());
				request.api = new lib.json.file ({directory});
				request.api.db.table = config.db.collection;
				}
			if (request.client.api.gateway.driver === "firebase") {
				var config = request.client.api.config [request.client.api.gateway.adapter || request.client.api.gateway.driver];
				request.api = new lib.api.firebase ({... config});
				request.api.db.table = config.db.collection;
				}
			if (request.client.api.gateway.driver === "appwrite") {
				var config = request.client.api.config [request.client.api.gateway.adapter || request.client.api.gateway.driver];
				request.api = new lib.api.appwrite ({url: config.url, socket: config.socket, project: config.project, db: config.db.id});
				request.api.db.table = config.db.collection;
				}
			if (request.client.api ["j:son"]) {
				var config = request.client.api.config ["j:son"];
				request.json = new lib.json.bin ({url: config.url});
				request.json.db.table = config.db.collection;
				}
			next ();
			}
		else response.error ("app");
		}
	}

express.client.param = function (app) {
	return function (request, response, next) {
		response.param ({
			"title": "UnTitled",
			"head:rest-api": request.url.protocol + "://" + app ["client.json"]["rest-api"],
			"head:language": "en",
			"head:author": "Newbie Citizen",
			"head:description": "Just another Web-Site/App",
			"head:generator": "Newbizen Studio",
			"head:keyword": "",
			"head:robot": "index, follow",
			"head:canonical": "",
			"head:manifest": express.path.data ["manifest.json"],
			});
		next ();
		}
	}

/**
 * xxx
 *
 * title
 * description
 * sub description
 *
 * xxx://xxx.xxx.xxx/xxx
 */

express.visitor = function (app) {
	return function (request, response, next) {
		var ip = request.header ["x-cross-origin-ip"] || request.header ["cf-connecting-ip"] || request.header ["x-forwarded-for"] || request.header ["x-real-ip"];
		var option = {
			country_code: request.header ["cf-ipcountry"] || request.header ["x-vercel-ip-country"],
			region_code: request.header ["x-vercel-ip-country-region"],
			city: decodeURI (request.header ["x-vercel-ip-city"] || ""),
			timezone: request.header ["x-vercel-ip-timezone"],
			latitude: request.header ["x-vercel-ip-latitude"],
			longitude: request.header ["x-vercel-ip-longitude"],
			}
		request.visitor = lib.ip.parse (ip, option);
		next ();
		}
	}

/**
 * xxx
 *
 * title
 * description
 * sub description
 *
 * xxx://xxx.xxx.xxx/xxx
 */

module.exports = exports = express;

/**
 * the end
 *
 * xxx://xxx.xxx.xxx/xxx
 */

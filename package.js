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
			Function.fs.api.engine.readFile (fp, function (error, content) {
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
			// response.public_html = dir;
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
		this.url = URL.parse_url (url, {
			protocol: this.header ["x-forwarded-proto"],
			"cross-origin": this.header ["origin"],
			});
		this.path = this.url.path;
		this ["cross-origin"] = this.url ["cross-origin"];
		this.cross = {origin: {id: "", ip: "", ... this.url.cross.origin}}
		this.date = new Date.time ();
		this.date.timezone ("UTC");
		this.router = {link: {data: []}}
		}
	query (key) {
		if (key) return this.express.request.query [key];
		else return this.url.query;
		}
	param (key) {
		return this.express.request.params [key];
		}
	}

express.request ["cgi-bin:db-collection"] = function (request) {
	var collection = request.xxx.server.config.db.collection;
	var data = [];
	for (var i in collection) data.push (express.path.data ["cgi-bin:db-collection"].to_param ({collection: i}));
	return data.includes (request.path);
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
		// this.public_html = this.express.response.public_html;
		}
	send (... data) {
		this.express.response.send (... data);
		return this;
		}
	html (template, param) {
		if (typeof template === "string") this.express.response.render (template, {... this.parameter, ... param});
		else this.express.response.render ("index", {... this.parameter, ... template});
		}
	json (data) {
		this.express.response.json (data);
		return this;
		}
	text (data) {
		this.express.response.type ("text");
		this.express.response.send (data);
		return this;
		}
	xml (data) {
		this.express.response.type ("xml");
		this.express.response.send (data);
		return this;
		}
	render (... render) {
		this.express.response.render (... render);
		return this;
		}
	file (file, option, context) {
		option = option || {}
		var root;
		if (option.root === "package") root = this.app.dir.package;
		else if (["public", "public_html"].includes (option.root)) root = this.app.dir.public;
		else root = this.app.dir.public;
		if (file.startsWith ("/")) file = file.substr (1);
		// this.express.response.sendFile (file, {root: this.express.response.public_html, ... option}, function (error) {
		this.express.response.sendFile (file, {root, ... option}, function (error) {
			if (error) this.express.response.status ("error:not-found").send ("Error (404) Not Found : File");
			if (context) context (error);
			}.bind ({express: this.express}));
		return this;
		}
	error (error) {
		if (error === "cross-origin") this.status ("error:forbidden").send ("Error (403) Forbidden : Cross Origin");
		else if (error === "app:not-found") this.status ("error:not-found").send ("Error (404) Not Found : App");
		else if (error === "host:not-found") this.status ("error:not-found").send ("Error (404) Not Found : Host");
		else if (error === "router:not-found") this.status ("error:not-found").send ("Error (404) Not Found : Router");
		else this.status ("error:internal").send (error);
		return this;
		}
	header (key, value) {
		this.express.response.setHeader (key, value);
		return this;
		}
	status (status) {
		if (status === "error:forbidden") status = 403;
		if (status === "error:not-found") status = 404;
		if (status === "error:internal") status = 500;
		this.express.response.status (status);
		return this;
		}
	type (type) {
		this.express.response.type (type);
		return this;
		}
	param (key, value) {
		if (value) this.parameter [key] = value;
		else for (var i in key) this.parameter [i] = key [i];
		return this;
		}
	manifest (data) {
		this.json (Function.manifest (data));
		return this;
		}
	robot (data) {
		return this.text (Function.robot (data));
		}
	}

/**
 * path
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
	if (path.startsWith ("/")) return path;
	else return ("/") + path;
	}

express.path.data = {
	"cgi-bin": "/cgi-bin",
	"cgi-bin:info": "/cgi-bin/info",
	"cgi-bin:setup": "/cgi-bin/setup",
	"cgi-bin:db-collection": "/cgi-bin/db/:collection",
	"cgi-bin:db.json": "/cgi-bin/db.json",
	"cgi-bin:file": "/cgi-bin/file/:file",
	"cgi-bin:security-challenge": "/cgi-bin/security/challenge",
	"cgi-bin:error": "/cgi-bin/error.html",
	"favorite:icon": "/favicon.ico",
	"favorite.ico": "/favorite.ico",
	"favorite.png:small": "/__asset/image/favorite/16x16.png",
	"favorite.png:medium": "/__asset/image/favorite/64x64.png",
	"favorite.png:extra-large": "/__asset/image/favorite/192x192.png",
	"favorite.png:big": "/__asset/image/favorite/512x512.png",
	"manifest.json": "/manifest.json",
	"sitemap.xml": "/sitemap.xml",
	"sitemap.xsl": "/sitemap.xsl",
	"robot.txt": "/robots.txt",
	"open-search.xml": "/opensearch.xml",
	"open-search.xml:description": "/osd.xml",
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

express.base = function (app) {
	return function (request, response, next) {
		var base;
		if (request ["cross-origin"]) base = request.cross.origin.base.name;
		else base = request.url.base.name;
		for (var i in app ["config.json"]["*"]) {
			var the = app ["config.json"]["*"][i];
			var identifier = the.identifier;
			if (Array.isArray (identifier)) for (var x in identifier) {
				var name = identifier [x];
				if (Function.help.host.check (base, name)) {
					if (request.xxx = {domain: base, api: {}, ... the}) {
						request.xxx.url = {path: express.path.data}
						request.xxx.server.config = app ["configuration.json"][request.xxx.server.driver][request.xxx.server.adapter];
						request.xxx.client.config = app ["configuration.json"][request.xxx.client.driver][request.xxx.client.adapter];
						request.xxx ["bin.json:config"] = app ["configuration.json"]["j:son"][request.xxx ["bin.json"]];
						break;
						}
					}
				}
			}
		if (request.xxx) {
			if (request.xxx.server.driver === "file:system") {
				var config = request.xxx.server.config;
				var directory = [app.dir.package, (config.directory || request.xxx.id || request.url.base.name), "db"].join (Function.path.separator ());
				request.api = new JSON.file ({directory});
				request.api.db.table = config.db.collection;
				}
			if (request.xxx.server.driver === "firebase") {
				var config = request.xxx.server.config;
				request.api = new Function.firebase (config);
				request.api.db.table = config.db.collection;
				}
			if (request.xxx.server.driver === "appwrite") {
				var config = request.xxx.server.config;
				request.api = new Function.appwrite ({url: config.url, socket: config.socket, project: config.project, db: config.db.id});
				request.api.db.table = config.db.collection;
				}
			if (request.xxx ["bin.json"]) {
				var config = request.xxx ["bin.json:config"];
				request.json = new JSON.bin ({url: config.url});
				request.json.db.table = config.db.collection;
				}
			request.api.db.collection ("config").select ().emit (function (db) {
				var router = {}
				for (var i in db.data) {
					if (db.data [i].key.startsWith ("router:")) router [db.data [i].key.substr ("router:".length)] = db.data [i].value;
					if (db.data [i].key.startsWith ("router-link:")) router [db.data [i].key.substr ("router-link:".length)] = db.data [i].value;
					}
				request.xxx.router = {regex: router}
				next ();
				});
			if (null) next ();
			}
		else response.error ("host:not-found");
		}
	}

express.base.param = function (app) {
	return function (request, response, next) {
		response.param ({
			"title": "UnTitled",
			"head:rest-api": URL.format (app ["config.json"]["rest-api"], {protocol: request.url.protocol}),
			"head:language": "en",
			"head:author": "Newbie Citizen",
			"head:description": "Just another Web-Site/App Platform",
			"head:generator": "Newbizen Studio",
			"head:keyword": "",
			"head:robot": ["index", "follow", ... express.base.param ["snippet:preview"]].join (),
			"head:canonical": "",
			"head:manifest": express.path.data ["manifest.json"],
			});
		next ();
		}
	}

express.base.param ["snippet:preview"] = ["max-snippet:-1", "max-image-preview:large", "max-video-preview:-1"];

/*
express.client = function (app) {
	return function (request, response, next) {
		var client;
		if (request ["cross-origin"]) client = request.cross.origin.base.name;
		else client = request.url.base.name;
		if (null) for (var i in app ["config.json"]["*"]) {
			var host = app ["config.json"]["*"][i];
			var identifier = host.identifier;
			if (Array.isArray (identifier)) for (var x in identifier) {
				var name = identifier [x];
				if (Function.help.host.check (client, name)) {
					if (request.client = {identifier: client, ... host}) {
						request.client.api.url = {path: express.path.data}
						break;
						}
					}
				}
			}
		for (var i in app ["client.json"].host) {
			var host = app ["client.json"].host [i];
			var identifier = host.identifier;
			if (Array.isArray (identifier)) for (var x in identifier) {
				var name = identifier [x];
				if (Function.help.host.check (client, name)) {
					if (request.client = {identifier: client, ... host}) {
						request.client.api.url = {path: express.path.data}
						break;
						}
					}
				}
			else if (Function.help.host.check (client, identifier)) {
				if (request.client = {identifier: client, ... host}) {
					request.client.api.url = {path: express.path.data}
					break;
					}
				}
			}
		if (null) for (var i in app ["client.json"].host) {
			if (Function.help.host.check (client, i)) {
				if (request.client = {identifier: client, ... app ["client.json"].host [i]}) {
					request.client.api.url = {path: express.path.data}
					break;
					}
				}
			}
		if (request.client) {
			if (request.client.api.gateway.driver === "file:system") {
				var config = request.client.api.config [request.client.api.gateway.adapter || request.client.api.gateway.driver];
				var directory = [app.dir.client, (config.directory || request.url.base.name), "db"].join (Function.path.separator ());
				request.api = new JSON.file ({directory});
				request.api.db.table = config.db.collection;
				}
			if (request.client.api.gateway.driver === "firebase") {
				var config = request.client.api.config [request.client.api.gateway.adapter || request.client.api.gateway.driver];
				request.api = new Function.api.firebase ({... config});
				request.api.db.table = config.db.collection;
				}
			if (request.client.api.gateway.driver === "appwrite") {
				var config = request.client.api.config [request.client.api.gateway.adapter || request.client.api.gateway.driver];
				request.api = new Function.api.appwrite ({url: config.url, socket: config.socket, project: config.project, db: config.db.id});
				request.api.db.table = config.db.collection;
				}
			if (request.client.api ["j:son"]) {
				var config = request.client.api.config ["j:son"];
				request.json = new JSON.bin ({url: config.url});
				request.json.db.table = config.db.collection;
				}
			request.api.db.collection ("config").select ().emit (function (db) {
				var router_regex = {}
				for (var i in db.data) {
					if (db.data [i].key.startsWith ("router:")) router_regex [db.data [i].key.substr ("router:".length)] = db.data [i].value;
					if (db.data [i].key.startsWith ("router-link:")) router_regex [db.data [i].key.substr ("router-link:".length)] = db.data [i].value;
					}
				request.client.api.router = {regex: router_regex}
				next ();
				});
			if (null) next ();
			}
		else response.error ("host:not-found");
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
			"head:robot": ["index", "follow", "max-image-preview:large", "max-snippet:-1", "max-video-preview:-1"].join (),
			"head:canonical": "",
			"head:manifest": express.path.data ["manifest.json"],
			});
		next ();
		}
	}
*/

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
		request.visitor = Function.ip.parse (ip, option);
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

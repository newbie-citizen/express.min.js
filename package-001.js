/**
 * express
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
 * app
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
	get (path, context) {
		if (Object.is_string (path)) this.$app.get (express.path (path), function (request, response, next) { context (request.io, response.io, next); });
		else this.$app.get (express.path (path.path), function (request, response, next) { if (request.io.url.domain.sub === path.sub) context (request.io, response.io, next); else next (); });
		return this;
		}
	post (path, context) {
		if (Object.is_string (path)) this.$app.post (express.path (path), function (request, response, next) { context (request.io, response.io, next); });
		else this.$app.post (express.path (path.path), function (request, response, next) { if (request.io.url.domain.sub === path.sub) context (request.io, response.io, next); else next (); });
		return this;
		}
	listen (host, port, context) { this.$app.listen (port, host, context); return this; }
	html (dir) {
		this.$app.engine ("html", function (fp, param, context) {
			Function.file.system.api.engine.readFile (fp, function (error, content) {
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

express.application = function (app) {
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
					if (request.app = {domain: base, api: {}, ... the}) {
						// request.app.url = {path: express.path.data}
						// request.app.server.config = app ["configuration.json"][request.app.server.driver][request.app.server.adapter];
						// request.app.client.config = app ["configuration.json"][request.app.client.driver][request.app.client.adapter];
						request.app.server.db = app ["configuration.json"][request.app.server ["db:driver"]][request.app.server ["db:use"]]
						request.app.client.db = app ["configuration.json"][request.app.client ["db:driver"]][request.app.client ["db:use"]]
						request.app ["bin.json:config"] = app ["configuration.json"]["j:son"][request.app ["bin.json"]];
						request.app.folder = [app.dir.src, (request.app.id || request.url.base.name)].join (Function.path.separator ());
						request.app.dir = {}
						if (true) request.app.dir.db = [app.dir.src, "0.0.0.0", "db"].join (Function.path.separator ())
						else request.app.dir.db = [request.app.folder, "db"].join (Function.path.separator ())
						request.app.file = {}
						request.app.file.system = new JSON.file ({directory: request.app.dir.db});
						if (request.app ["child:process"]) {
							request.app.directory = [request.app.folder, request.url.domain.sub].join (Function.path.separator ());
							// request.app.dir = {package: [app.dir.src, (request.app.id || request.url.base.name), request.url.domain.sub].join (Function.path.separator ())}
							}
						else {
							request.app.directory = request.app.folder;
							// request.app.dir = {package: [app.dir.src, (request.app.id || request.url.base.name)].join (Function.path.separator ())}
							}
						break;
						}
					}
				}
			}
		if (request.app) next ();
		else response.error ("host:not-found");
		}
	}

/**
 * request
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
		this.express = {app, request, response}
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
		this.$__config = {}
		this.$__router = {}
		this.$__tag = {}
		this.$__category = {}
		this.$__db = {
			config: [], configuration: [],
			account: [], user: [],
			route: [], router: [],
			content: [], product: [],
			taxonomy: [], tag: [], category: [], sitemap: [],
			ip_address: [], visitor: [],
			}
		// this.router = {url: {}, link: {}, "link:slot": {}, "link:attribute": {}}
		}
	query (key) {
		if (key) return this.express.request.query [key];
		else return this.url.query;
		}
	param (key) {
		if (key === "*") return this.express.request.params ["0"];
		else if (key) return this.express.request.params [key];
		else return this.express.request.params;
		}
	}

express.request ["cgi-bin:db collection"] = function (request) {
	var collection = request.app.server.config.db.collection;
	var data = [];
	for (var i in collection) data.push (express.path ("cgi-bin:db collection").to_param ({collection: i}));
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
		this.express = {app, request, response}
		this.next = next;
		this.__construct ();
		}
	__construct () {
		this.parameter = {}
		this.url = {}
		for (var i in express.path.data) this.url [i] = this.express.request.io.url.host.reference + express.path.data [i];
		}
	send (... data) {
		this.express.response.send (... data);
		return this;
		}
	html (template, param) {
		if (typeof template === "string") this.express.response.render (template, {... this.parameter, ... param});
		else this.express.response.render ("index", {... this.parameter, ... template});
		}
	text (data) {
		this.express.response.type ("text");
		this.express.response.send (data);
		return this;
		}
	json (data) {
		this.express.response.json (data);
		return this;
		}
	xml (data) {
		this.express.response.type ("xml");
		this.express.response.send (data);
		return this;
		}
	xsl (data) {
		this.express.response.type ("text/xsl");
		this.express.response.send (data);
		return this;
		}
	render (... render) {
		this.express.response.render (... render);
		return this;
		}
	file (file, option, context) {
		if (file.startsWith ("/")) file = file.substr (1);
		option = option || {}
		var root;
		if (option.root === "app:directory") root = this.express.request.io.app.directory;
		else if (option.root === "package") root = this.express.app.dir.package;
		else if (["public", "public_html"].includes (option.root)) root = this.express.app.dir.public;
		else root = this.express.app.dir.public;
		delete option.root;
		this.express.response.sendFile (file, {root, ... option}, function (error) {
			if (error) this.express.response.status (404).send ("Error (404) Not Found : File");
			if (context) context (error);
			}.bind ({express: this.express}));
		return this;
		}
	error (error) {
		if (error === "cross-origin") this.status ("error:forbidden").send ("Error (403) Forbidden : Cross Origin");
		else if (error === "not-found") this.status ("error:not-found").send ("Error (404) Not Found");
		else if (error === "app:not-found") this.status ("error:not-found").send ("Error (404) Not Found : App");
		else if (error === "host:not-found") this.status ("error:not-found").send ("Error (404) Not Found : Host");
		else if (error === "router:not-found") this.status ("error:not-found").send ("Error (404) Not Found : Router");
		else if (error === "url:not-found") this.status ("error:not-found").send ("Error (404) Not Found : URL");
		else if (error === "api:not-found") this.status ("error:internal").send ("Error (500) Internal Server Error : API");
		else this.status ("error:internal").send (error || "Error (500) Internal Server Error");
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
	"cgi-bin:db install": "/cgi-bin/setup/db/install",
	"cgi-bin:db collection": "/cgi-bin/db/collection/:collection",
	"cgi-bin:db.json": "/cgi-bin/db.json",
	"cgi-bin:file": "/cgi-bin/file/:file",
	"cgi-bin:security challenge": "/cgi-bin/security/challenge",
	"cgi-bin:error": "/cgi-bin/error.html",
	"favorite:icon": "/favicon.ico",
	"favorite.ico": "/favorite.ico",
	"favorite.png": "/__asset/image/favorite/:size.png",
	"favorite.png:small": "/__asset/image/favorite/16x16.png",
	"favorite.png:medium": "/__asset/image/favorite/64x64.png",
	"favorite.png:medium-rare": "/__asset/image/favorite/192x192.png",
	"favorite.png:big": "/__asset/image/favorite/512x512.png",
	"manifest.json": "/manifest.json",
	"robot.txt": "/robots.txt",
	"sitemap": "/sitemap.html",
	"sitemap.xml": "/sitemap.xml",
	"sitemap.xml:latest": "/latest.xml",
	"sitemap.xml:index": "/sitemap/:index.xml",
	"sitemap.xml:index_of": "/sitemap/:index/:index_of.xml",
	"sitemap.xsl": "/sitemap.xsl",
	"sitemap.xsl:index": "/sitemap/index.xsl",
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
		if (request.url.host.address === get_config (app, "rest-api")) request.rest_api = true;
		if (request.url.domain.sub === app ["config.json"]["web:rest-api"]) request.rest_api = true;
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
 * db
 *
 * title
 * description
 * sub description
 *
 * xxx://xxx.xxx.xxx/xxx
 */

express.db = function (app) {
	return function (request, response, next) {
		var db = {}, length = 0;
		var count = function () {
			length ++;
			if (length === Object.length (db)) {
				next ();
				}
			}
		if (db.config = request.api.db.collection ("config").select ({limit: "default"})) {
			db.config.then (function (db) {
				for (var i in db.data) {
					request.$__db.config.push (db.data [i]);
					request.$__config [db.data [i].key] = db.data [i];
					}
				count ();
				});
			db.config.catch (function (error) {
				console.log (error);
				count ();
				});
			}
		if (db.router = request.api.db.collection ("router").select ({limit: "large"})) {
			db.router.then (function (db) {
				var router = db.data.map (function (data) {
					data.meta = lib.json.decode (data.meta, {});
					data.parent_id = [];
					data.child = [];
					return data;
					});
				for (var i in router) {
					request.$__db.router.push (router [i]);
					if (router [i].type) {}
					else request.$__router [router [i].key] = router [i];
					}
				count ();
				});
			db.router.catch (function (error) {
				console.log (error);
				count ();
				});
			}
		if (db.taxonomy = request.api.db.collection ("taxonomy").select ({limit: "large"})) {
			db.taxonomy.then (function (db) {
				var taxonomy = db.data.map (function (data) {
					data.meta = lib.json.decode (data.meta, {});
					data.parent_id = [];
					data.child = [];
					return data;
					});
				for (var i in taxonomy) {
					request.$__db.taxonomy.push (taxonomy [i]);
					if (taxonomy [i].type === "tag") request.$__db.tag.push (request.$__tag [taxonomy [i].id] = taxonomy [i]);
					if (taxonomy [i].type === "category") request.$__db.category.push (request.$__category [taxonomy [i].id] = taxonomy [i]);
					if (taxonomy [i].type === "sitemap") request.$__db.sitemap.push (taxonomy [i]);
					}
				count ();
				});
			db.taxonomy.catch (function (error) {
				console.log (error);
				count ();
				});
			}
		}
	}

express.db.start = function () {
	return function (request, response, next) {
		if (request.app.server.driver === "file:system") {
			var config = request.app.server.config;
			request.api = new JSON.file ({directory: request.app.dir.db});
			request.api.db.table = config.db.collection;
			next ();
			}
		if (request.app.server.driver === "mongo") {
			var config = request.app.server.config;
			var mongo = new Function.mongo (config);
			request.db = mongo.database (mongo, config.db.name);
			request.api.db.table = config.db.collection;
			request.api.connect (next);
			}
		if (request.app.server.driver === "firebase") {
			var config = request.app.server.config;
			request.api = new Function.firebase (config);
			request.api.db.table = config.db.collection;
			next ();
			}
		if (request.app.server.driver === "appwrite") {
			var config = request.app.server.config;
			request.api = new Function.appwrite ({url: config.url, socket: config.socket, project: config.project, db: config.db.id});
			request.api.db.table = config.db.collection;
			next ();
			}
		if (request.app ["bin.json"]) {
			var config = request.app ["bin.json:config"];
			request.json = new JSON.bin ({url: config.url});
			request.json.db.table = config.db.collection;
			}
		if (request.api) {}
		else response.error ("api:not-found");
		}
	}

express.db.extra = function (app) {
	return function (request, response, next) {
		Function.help.db.child.recursive (request.$__db.router, request.$__db.router);
		Function.help.db.child.recursive (request.$__db.tag, request.$__db.taxonomy);
		Function.help.db.parent_id.recursive (request.$__db.category, request.$__db.taxonomy);
		Function.help.db.child.recursive (request.$__db.category, request.$__db.taxonomy);
		Function.help.db.child.recursive (request.$__db.sitemap, request.$__db.taxonomy);
		request.$__db.tag = request.$__db.tag.map (function (data) {
			if (data.url) {}
			else {
				data.url = request.$__router ["tag"].path.to_param ({key: data.key});
				}
			return data;
			});
		request.$__db.category = request.$__db.category.map (function (data) {
			if (data.url) {}
			else {
				var path = [data.key];
				for (var i in data.parent_id) path.push (request.$__category [data.parent_id [i]].key);
				path = path.reverse ().join ("/");
				data.url = request.$__router ["category"].path.to_param (path);
				}
			return data;
			});
		for (var i in request.$__db.tag) request.$__tag [request.$__db.tag [i].id] = request.$__db.tag [i];
		for (var i in request.$__db.category) request.$__category [request.$__db.category [i].id] = request.$__db.category [i];
		next ();
		}
	}

express.var = function (app) {
	return function (request, response, next) {
		response.param ({
			"title": "UnTitled",
			"head:rest-api": URL.format (get_config (app, "rest-api"), {protocol: request.url.protocol}),
			"head:language": "en",
			"head:author": "Newbie Citizen",
			"head:description": "Just another Web-Site/App Platform",
			"head:generator": "Newbizen Studio",
			"head:keyword": "",
			"head:robot": ["index", "follow", ... express.var ["snippet:preview"]].join (),
			"head:canonical": "",
			"head:manifest": express.path ("manifest.json"),
			});
		next ();
		}
	}

express.var ["snippet:preview"] = ["max-snippet:-1", "max-image-preview:large", "max-video-preview:-1"];

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

function get_config (app, key) {
	if (app ["config.json"].development) return app ["config.json"][[key, "local"].join (":")];
	else return app ["config.json"][[key, "io"].join (":")];
	}

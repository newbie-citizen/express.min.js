const express = require ("express.min.js");
const lib = require ("lib.min.js");

express.plugin = function () {}

express.plugin.parse_url = function (app, request) {
	var parse_url = lib.parse_url ({
		host: request.headers ["host"],
		host_name: request.hostname,
		path: request.path,
		query: request.query,
		"origin": request.headers ["origin"],
		"x-forwarded-proto": request.headers ["x-forwarded-proto"],
		});
	request.client.host = {name: parse_url.client.host.name}
	request.cross.origin = parse_url.cross.origin;
	return parse_url;
	}

express.plugin.visitor = function (app, request) {
	var ip = request.headers ["x-client-ip"] || request.headers ["cf-connecting-ip"] || request.headers ["x-forwarded-for"] || request.headers ["x-real-ip"];
	var option = {
		country_code: request.headers ["cf-ipcountry"] || request.headers ["x-vercel-ip-country"],
		region_code: request.headers ["x-vercel-ip-country-region"],
		city: decodeURI (request.headers ["x-vercel-ip-city"] || ""),
		timezone: request.headers ["x-vercel-ip-timezone"],
		latitude: request.headers ["x-vercel-ip-latitude"],
		longitude: request.headers ["x-vercel-ip-longitude"],
		}
	return lib.ip.parse (ip, option);
	}

module.exports = exports = express.plugin;

/*
express.plugin.parse_url = function (app, request) {
	var parse_url = {
		reference: "",
		referer: "",
		address: "",
		protocol: "http",
		scheme: "http://",
		host: {address: request.headers ["host"], name: request.hostname, port: ""},
		user: "", password: "",
		path: request.path,
		query: request.query || {},
		}
	var host;
	if (parse_url.host.address) {
		var host;
		if ((host = parse_url.host.address.split ("@")).length > 1) {}
		else {
			if ((host = parse_url.host.address.split (":")).length > 1) {
				parse_url.host.port = host [1];
				}
			}
		}
	if (parse_url.password) host = parse_url.user + ":" + parse_url.password + "@" + parse_url.host.name;
	else if (parse_url.user) host = parse_url.user + "@" + parse_url.host.name;
	else host = parse_url.host.name;
	if (parse_url.port) host = host + ":" + parse_url.port;
	if (request.headers ["x-forwarded-proto"]) {
		parse_url.protocol = request.headers ["x-forwarded-proto"];
		parse_url.scheme = parse_url.protocol + "://";
		}
	parse_url.address = parse_url.scheme + host + parse_url.path;
	var query = [];
	for (var i in parse_url.query) query.push (i + "=" + parse_url.query [i]);
	if (query.length) parse_url.address = parse_url.scheme + host + parse_url.path + "?" + query.join ("&");
	var url;
	if (url = request.headers ["origin"]) {
		var url = url.split ("://");
		request.client.host = {protocol: url [0], name: url [1].split (":") [0]}
		request.cross.origin = true;
		}
	return parse_url;
	}

express.plugin.ip = function () {}

express.plugin.ip.trace = function (ip, input = {}) {
	var ip_reserve = express.plugin.ip.reserve ();
	var ip_local = express.plugin.ip.reserve ("local");
	var data = {
		ip: {address: (ip || ip_local), network: "", mask: "", version: 4},
		internet: {service: {name: "", provider: ""}},
		country: express.plugin.geo.country (), region: {code: "", name: ""}, city: {code: "", name: ""},
		timezone: {code: "GMT", name: "", offset: "+00:00"},
		language: [],
		coordinate: {latitude: "0", longitude: "0"},
		}
	if (data.ip.address === ("::ffff:" + ip_local)) data.ip.address = ip_local;
	if (data.ip.address.includes (":")) data.ip.version = 6;
	else data.ip.version = 4;
	data.country = express.plugin.geo.country (input.country_code);
	data.region.code = input.region_code || "";
	data.region.name = input.region || "";
	data.city.code = input.city_code || "";
	data.city.name = input.city || "";
	data.timezone.code = input.timezone || data.timezone.code;
	data.timezone.offset = input.utc_offset || data.timezone.offset;
	data.coordinate.latitude = input.latitude || data.latitude;
	data.coordinate.longitude = input.longitude || data.longitude;
	return data;
	}

express.plugin.ip.reserve = function (ip) {
	if (ip === "local") return "127.0.0.1";
	else if (ip === "sub") return "255.255.255.0";
	else return "0.0.0.0";
	}

express.plugin.geo = function () {}

express.plugin.geo.country = function (code) {
	return express.plugin.geo.country.data [code] || {
		code: "",
		name: "",
		capital: {code: "", name: "", coordinate: {latitude: "", longitude: ""}},
		region: {data: {}, city: {data: {}}},
		coordinate: {latitude: "", longitude: ""},
		currency: {code: "", name: ""},
		population: "",
		language: [],
		domain: [],
		}
	}

express.plugin.geo.country.region = function () {}
express.plugin.geo.country.region.city = function () {}

express.plugin.geo.country.data = {}
express.plugin.geo.country.region.data = {}
express.plugin.geo.country.region.city.data = {}

for (var i in express.json ["geo"].country.data) {
	express.plugin.geo.country.data [express.json ["geo"].country.data [i].code] = express.json ["geo"].country.data [i];
	for (var x in express.json ["geo"].country.region.data) {
		if (express.json ["geo"].country.region.data [x].id) {
			if (express.json ["geo"].country.region.data [x].country === express.json ["geo"].country.data [i].id) {
				express.plugin.geo.country.data [express.json ["geo"].country.data [i].code].region.data [express.json ["geo"].country.region.data [x].code] = express.json ["geo"].country.region.data [x];
				for (var o in express.json ["geo"].country.region.city.data) {
					if (express.json ["geo"].country.region.city.data [o].id) {
						if (express.json ["geo"].country.region.city.data [o].country === express.json ["geo"].country.data [i].id) {
							if (express.json ["geo"].country.region.city.data [o].region === express.json ["geo"].country.region.data [x].id) {
								express.plugin.geo.country.data [express.json ["geo"].country.data [i].code].region.city.data [express.json ["geo"].country.region.city.data [o].code] = express.json ["geo"].country.region.city.data [o];
								}
							}
						}
					}
				}
			}
		}
	}

express.url = lib.url;
*/

/*
express.plugin.visitor = function (app, request) {
	var visitor = {
		ip: {address: "0.0.0.0", network: "", mask: "", version: 4},
		internet: {service: {name: "", provider: ""}},
		country: express.plugin.visitor.country (),
		timezone: {id: "", offset: ""},
		language: [],
		coordinate: {latitude: "", longitude: ""},
		}
	visitor.ip.address = request.headers ["cf-connecting-ip"] || request.headers ["x-forwarded-for"] || request.headers ["x-real-ip"] || visitor.ip.address;
	if (visitor.ip.address === "::ffff:127.0.0.1") visitor.ip.address = "127.0.0.1";
	if (visitor.ip.address.includes (":")) visitor.ip.version = 6;
	else visitor.ip.version = 4;
	visitor.country.code = request.headers ["cf-ipcountry"] || request.headers ["x-vercel-ip-country"] || "";
	visitor.country.name = express.plugin.visitor.country (visitor.country.code).name || "";
	visitor.country.region = {code: request.headers ["x-vercel-ip-country-region"] || ""}
	visitor.country.city = {name: decodeURI (request.headers ["x-vercel-ip-city"] || "")}
	visitor.timezone.id = request.headers ["x-vercel-ip-timezone"] || "GMT";
	visitor.coordinate.latitude = request.headers ["x-vercel-ip-latitude"] || "0";
	visitor.coordinate.longitude = request.headers ["x-vercel-ip-longitude"] || "0";
	if (["0.0.0.0", "127.0.0.1"].includes (visitor.ip.address)) {
		request._is_local_ip_address = true;
		}
	else {
		if (null) {
			express.url.get ("https://ipapi.co/" + visitor.ip.address + "/json/").catch (console.error).then (function (url) {
				response.send (url.data);
				});
			}
		}
	return visitor;
	}
*/

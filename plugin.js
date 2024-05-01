const express = require ("express.min.js");

express.plugin.parse_url = function (app, request) {
	var parse_url = {reference: "", protocol: "http", scheme: "http://", host: {reference: request.headers ["host"], name: request.hostname, port: "", user: "", password: ""}, path: request.url, query: {}, origin: ""}
	var host;
	if (parse_url.host.reference) {
		var host_split;
		if (parse_url.host.reference.split ("@").length > 1) {}
		else {
			if ((host_split = parse_url.host.reference.split (":")).length > 1) {
				parse_url.host.port = host_split [1];
				}
			}
		}
	if (parse_url.host.password) host = parse_url.host.user + ":" + parse_url.host.password + "@" + parse_url.host.name;
	else if (parse_url.host.user) host = parse_url.host.user + "@" + parse_url.host.name;
	else host = parse_url.host.name;
	if (parse_url.port) host = host + ":" + parse_url.port;
	if (request.headers ["x-forwarded-proto"]) {
		parse_url.protocol = request.headers ["x-forwarded-proto"];
		parse_url.scheme = parse_url.protocol + "://";
		}
	parse_url.reference = parse_url.scheme + host + parse_url.path;
	parse_url.origin = request.headers ["origin"];
	return parse_url;
	}

express.plugin.visitor = function (app, request) {
	var visitor = {ip: {address: "0.0.0.0"}, url: {reference: "", host: {}}, client: false}
	visitor.ip.address = request.headers ["cf-connecting-ip"] || request.headers ["x-forwarded-for"] || request.headers ["x-real-ip"];
	if (visitor.ip.address === "::ffff:127.0.0.1") visitor.ip.address = "127.0.0.1";
	if (visitor.ip.address.includes (":")) visitor.ip.version = 6;
	else visitor.ip.version = 4;
	visitor.ip.country = {}
	visitor.ip.country.code = request.headers ["x-vercel-ip-country"] || "";
	visitor.ip.country.name = express.plugin.visitor.country.name [visitor.ip.country.code] || "";
	visitor.ip.country.region = {code: request.headers ["x-vercel-ip-country-region"] || ""}
	visitor.ip.country.city = {name: decodeURI (request.headers ["x-vercel-ip-city"] || "")}
	visitor.ip.timezone = {name: request.headers ["x-vercel-ip-timezone"] || "GMT"}
	visitor.ip.latitude = request.headers ["x-vercel-ip-latitude"] || "0";
	visitor.ip.longitude = request.headers ["x-vercel-ip-longitude"] || "0";
	var url;
	if (url = request.headers ["origin"]) {
		visitor.client = true;
		var split = url.split ("://");
		visitor.url.protocol = split [0];
		visitor.url.host = {name: split [1].split (":") [0]}
		}
	return visitor;
	}

express.plugin.visitor.country = {
	name: {
		"ID": "Indonesia",
		"MY": "Malaysia",
		"SG": "Singapore",
		"CN": "China",
		"JP": "Japan",
		"KR": "Korea",
		"US": "United State",
		"USA": "United State of America",
		"UK": "United Kingdom",
		"AU": "Australia",
		"NZ": "New Zeland",
		},
	}

module.exports = exports = express.plugin;

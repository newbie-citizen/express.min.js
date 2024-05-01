const express = require ("express.min.js");

express.plugin.parse_url = function (app, request) {
	var parse_url = {
		reference: "",
		protocol: "http",
		scheme: "http://",
		host: {reference: request.headers ["host"], name: request.hostname, port: ""},
		user: "", password: "",
		path: request.path,
		query: {},
		}
	var host;
	if (parse_url.host.reference) {
		var h;
		if (parse_url.host.reference.split ("@").length > 1) {}
		else {
			if ((h = parse_url.host.reference.split (":")).length > 1) {
				parse_url.host.port = h [1];
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
	parse_url.reference = parse_url.scheme + host + parse_url.path;
	var url;
	if (url = request.headers ["origin"]) {
		var url = url.split ("://");
		request.client.host = {protocol: url [0], name: url [1].split (":") [0]}
		request.cross.origin = true;
		}
	return parse_url;
	}

express.plugin.visitor = function (app, request) {
	var visitor = {
		ip: {address: "0.0.0.0", network: "", version: 4},
		internet: {service: {name: "", provider: ""}},
		country: {
			name: "",
			capital: "",
			code: "",
			city: {name: ""},
			region: {name: "", code: ""},
			currency: {name: "", code: ""},
			population: "",
			domain: "",
			},
		timezone: {id: ""},
		coordinate: {latitude: "", longitude: ""},
		}
	visitor.ip.address = request.headers ["cf-connecting-ip"] || request.headers ["x-forwarded-for"] || request.headers ["x-real-ip"];
	if (visitor.ip.address === "::ffff:127.0.0.1") visitor.ip.address = "127.0.0.1";
	if (visitor.ip.address.includes (":")) visitor.ip.version = 6;
	else visitor.ip.version = 4;
	visitor.country.code = request.headers ["cf-ipcountry"] || request.headers ["x-vercel-ip-country"] || "";
	visitor.country.name = express.plugin.visitor.country.name [visitor.country.code] || "";
	visitor.country.region = {code: request.headers ["x-vercel-ip-country-region"] || ""}
	visitor.country.city = {name: decodeURI (request.headers ["x-vercel-ip-city"] || "")}
	visitor.timezone = {id: request.headers ["x-vercel-ip-timezone"] || "GMT"}
	visitor.latitude = request.headers ["x-vercel-ip-latitude"] || "0";
	visitor.longitude = request.headers ["x-vercel-ip-longitude"] || "0";
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

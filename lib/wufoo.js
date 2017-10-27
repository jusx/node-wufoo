/**
 * Main Wufoo API Wrapper Object.
 */
var util = require("util");
var request = require("request");
var utils = require("./utils.js");
var Generics = require("./generics.js");
var WebHook = require("./webhook.js");
var GenericEntity = Generics.GenericEntity;
var GenericParentEntity = Generics.GenericParentEntity;

module.exports = Wufoo;

/**
 * Constructor.
 * @param {String} account Wufoo account name / subdomain
 * @param {String} apiKey Wufoo account API key
 */
function Wufoo(account, apiKey) {
   this.account = account;
   this.url = "https://"+account+".wufoo.com/api/v3/";
   this.apiKey = apiKey;
}

// build the arguments params, fn
Wufoo.prototype.buildArgs = function() { // (arguments)
  var args = Array.prototype.slice.call(arguments, 0),
     params = (args.length==2 ? args.shift() : {}),
     fn = args.shift();
  return {params: params, fn: fn};
}

// build the arguments id, params, fn
Wufoo.prototype.buildArgsWithId = function() { // (arguments)
  var args = Array.prototype.slice.call(arguments, 0),
     id = args.shift(),
     params = (args.length==2 ? args.shift() : {}),
     fn = args.shift();
  return {id: id, params: params, fn: fn};
}

// get all the forms for this account/subdomain.
Wufoo.prototype.getForms = function() { // (params, fn)
   var args = this.buildArgs.apply(null, arguments);
   this._getObjects("forms", args.params, args.fn, "Forms", Form);
}

// get the form given the id/hash.
Wufoo.prototype.getForm = function() { // (id, params, fn)
   var args = this.buildArgsWithId.apply(null, arguments);
   this._getObjects("forms/" + args.id, args.params, args.fn, "Forms", Form, true);
}

// get all the form entries given the form id/hash.
Wufoo.prototype.getFormEntries = function() { // (id, params, fn)
   var args = this.buildArgsWithId.apply(null, arguments);
   this._getObjects("forms/" + args.id + "/entries", args.params, args.fn, "Entries", GenericEntity);
}

// get all the reports for this account/subdomain.
Wufoo.prototype.getReports = function() { // (params, fn)
   var args = this.buildArgs.apply(null, arguments);
   this._getObjects("reports", args.params, args.fn, "Reports", Report);
}

// get the report given the report id.
Wufoo.prototype.getReport = function() { // (id, params, fn)
   var args = this.buildArgsWithId.apply(null, arguments);
   this._getObjects("reports/" + args.id, args.params, args.fn, "Reports", Report, true);
}

 // get all the form entries given the report id/hash.
Wufoo.prototype.getReportEntries = function() { // (id, params, fn)
   var args = this.buildArgsWithId.apply(null, arguments);
   this._getObjects("reports/" + args.id + "/entries", args.params, args.fn, "Entries", GenericEntity);
}

// get the form fields given the form id/hash.
Wufoo.prototype.getFields = function() { // (id, params, fn)
   var args = this.buildArgsWithId.apply(null, arguments);
   this._getObjects("forms/" + args.id + "/fields", args.params, args.fn, "Fields", GenericEntity);
}

// get the widgets from wufoo given the reportid/hash.
Wufoo.prototype.getWidgets = function() { // (id, params, fn)
   var args = this.buildArgsWithId.apply(null, arguments);
   this._getObjects("reports/" + args.id + "/widgets", args.params, args.fn, "Widgets", GenericEntity);
}

// get form comments given form id/hash
Wufoo.prototype.getComments = function() { // (id, params, fn)
   var args = this.buildArgsWithId.apply(null, arguments);
   this._getObjects("forms/" + args.id + "/comments", args.params, args.fn, "Comments", GenericEntity);
}

// get the count for the comments of a form given the id/hash.
Wufoo.prototype.getCommentCount = function() { // (id, params, fn)
   var args = this.buildArgsWithId.apply(null, arguments);
   this._getMethod("forms/" + args.id + "/comments/count", args.params, function(err, json) {
      args.fn(err, Number(json.Count));
   });
}

// returns the WebHook object
Wufoo.prototype.webhook = function() {
   if (this.webhookCache == undefined) this.webhookCache = new WebHook(this);
   return this.webhookCache;
}

// helper method for doing a get.
Wufoo.prototype.get = function (uri, params, fn) {
   this.request("GET", uri, params, fn);
}

// This is a utility method to make API calls to Wufoo. i.e. https://{subdomain}.wufoo.com/api/v3
// It takes care of authentication. Callback function will receive two parameters the http error if any and the object representation of the json returned from Wufoo.
// method: GET, POST, PUT, etc.
//    uri: full uri
//     fn: callback function.
Wufoo.prototype.request = function(method, uri, params, fn) {

   var options = {
      uri: uri,
      method: method.toUpperCase(),
      headers: {
         "Authorization" : "Basic " + new Buffer(this.apiKey + ":footastic").toString("base64")
      }
   }

   if (fn!=undefined && params !=undefined) options["body"] = require('querystring').stringify(params); // params for form post was passed in.
   if (fn == undefined && params != undefined) fn = params; // no params was passed in. In which case it is fn callback.

   request(options, function(err, res, body) {
      if (err){console.error(err);}
      fn(err, JSON.parse(body));
   });
}

// ----- internal helper methods. ------
Wufoo.prototype._getObjects = function(path, params, fn, jsonType, klass, firstElm) {
   var self = this;
   this._getMethod(path, params, function(err, json) {
      //console.log(json);
      if (!json.HTTPCode)
      objects =  utils.cloneObjects(eval("json." + jsonType), function(){return new klass(self);});
      else
      objects = json;
      fn(err, (firstElm)? objects[0] : objects);
   });
}

Wufoo.prototype._getMethod = function (method, params, fn) {
   this.get(this._toUri(method), params, fn);
}

Wufoo.prototype._toUri = function(path) {
   return this.url + path + ".json";
}

//---------- Form ----------
util.inherits(Form, GenericParentEntity);
function Form(wufoo) {
   this.wufoo = wufoo;
}

Form.prototype.addWebhook = function(opt, fn) {
   this.wufoo.webhook().add(this.hash, opt, fn);
}

Form.prototype.deleteWebhook = function(hookid, fn) {
   this.wufoo.webhook().delete(this.hash, hookid, fn);
}

//---------- Report --------
util.inherits(Report, GenericParentEntity);
function Report(wufoo){
   this.wufoo = wufoo;
}

Report.prototype.getWidgets = function() {
   var args = this.buildArgs.apply(null, arguments);
   this._cacheOrFetch(this.linkWidgets, "Widgets", args.params, args.fn);
}

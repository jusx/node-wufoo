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

// build the arguments id, params, fn
Wufoo.prototype.buildArgsWithId = function() { // (arguments)
  var args = Array.prototype.slice.call(arguments, 0),
     id = args.shift(),
     params = (args.length==2 ? args.shift() : {}),
     fn = args.shift();
  return {id: id, params: params, fn: fn};
}

// get all the forms for this account/subdomain.
Wufoo.prototype.getForms = getForms;
Wufoo.prototype.getFormsAsync = util.promisify(getForms);
function getForms() { // (params, fn)
   var args = utils.buildArgs.apply(null, arguments);
   this._getObjects("forms", args.params, "Forms", Form, args.fn);
}

// get the form given the id/hash.
Wufoo.prototype.getForm = getForm;
Wufoo.prototype.getFormAsync = util.promisify(getForm);
function getForm() { // (id, params, fn)
   var args = this.buildArgsWithId.apply(null, arguments);
   this._getObject("forms/" + args.id, args.params, "Forms", Form, args.fn);
}

// get all the form entries given the form id/hash.
Wufoo.prototype.getFormEntries = getFormEntries;
Wufoo.prototype.getFormEntriesAsync = util.promisify(getFormEntries);
function getFormEntries() { // (id, params, fn)
   var args = this.buildArgsWithId.apply(null, arguments);
   this._getObjects("forms/" + args.id + "/entries", args.params, "Entries", GenericEntity, args.fn);
}

// get all the reports for this account/subdomain.
Wufoo.prototype.getReports = getReports;
Wufoo.prototype.getReportsAsync = util.promisify(getReports);
function getReports() { // (params, fn)
   var args = utils.buildArgs.apply(null, arguments);
   this._getObjects("reports", args.params, "Reports", Report, args.fn);
}

// get the report given the report id.
Wufoo.prototype.getReport = getReport;
Wufoo.prototype.getReportAsync = util.promisify(getReport);
function getReport() { // (id, params, fn)
   var args = this.buildArgsWithId.apply(null, arguments);
   this._getObject("reports/" + args.id, args.params, "Reports", Report, args.fn);
}

 // get all the form entries given the report id/hash.
Wufoo.prototype.getReportEntries = getReportEntries;
Wufoo.prototype.getReportEntriesAsync = util.promisify(getReportEntries);
function getReportEntries() { // (id, params, fn)
   var args = this.buildArgsWithId.apply(null, arguments);
   this._getObjects("reports/" + args.id + "/entries", args.params, "Entries", GenericEntity, args.fn);
}

// get the form fields given the form id/hash.
Wufoo.prototype.getFields = getFields;
Wufoo.prototype.getFieldsAsync = util.promisify(getFields);
function getFields() { // (id, params, fn)
   var args = this.buildArgsWithId.apply(null, arguments);
   this._getObjects("forms/" + args.id + "/fields", args.params, "Fields", GenericEntity, args.fn);
}

// get the widgets from wufoo given the reportid/hash.
Wufoo.prototype.getWidgets = getWidgets;
Wufoo.prototype.getWidgetsAsync = util.promisify(getWidgets);
function getWidgets() { // (id, params, fn)
   var args = this.buildArgsWithId.apply(null, arguments);
   this._getObjects("reports/" + args.id + "/widgets", args.params, "Widgets", GenericEntity, args.fn);
}

// get form comments given form id/hash
Wufoo.prototype.getComments = getComments;
Wufoo.prototype.getCommentsAsync = util.promisify(getComments);
function getComments() { // (id, params, fn)
   var args = this.buildArgsWithId.apply(null, arguments);
   this._getObjects("forms/" + args.id + "/comments", args.params, "Comments", GenericEntity, args.fn);
}

// get the count for the comments of a form given the id/hash.
Wufoo.prototype.getCommentCount = getCommentCount;
Wufoo.prototype.getCommentCountAsync = util.promisify(getCommentCount);
function getCommentCount() { // (id, params, fn)
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

   if (fn!=undefined && params !=undefined) {
      var stringified = require("querystring").stringify(params);
      if (options["method"]=="GET") options["uri"] = options["uri"] +  "?" + stringified;
      else options["body"] = stringified; // params for form post was passed in.
   }
   if (fn == undefined && params != undefined) fn = params; // no params was passed in. In which case it is fn callback.

   request(options, function(err, res, body) {
      if (err){console.error(err);}
      fn(err, JSON.parse(body));
   });
}

// ----- internal helper methods. ------
Wufoo.prototype._getObject = function(path, params, jsonType, klass, fn) {
   var self = this;
   this._getMethod(path, params, function(err, json) {
      fn(err, _getObjectsHelper(json, jsonType, klass, self)[0]);
   });
}

Wufoo.prototype._getObjects = function(path, params, jsonType, klass, fn) {
   var self = this;
   this._getMethod(path, params, function(err, json) {
      fn(err, _getObjectsHelper(json, jsonType, klass, self));
   });
}

function _getObjectsHelper(json, jsonType, klass, self) {
   if (!json.HTTPCode) objects = utils.cloneObjects(eval("json." + jsonType), function(){return new klass(self);});
   else objects = json;
   return objects;
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

Form.prototype.addWebhook = addWebhook;
Form.prototype.addWebhookAsync = util.promisify(addWebhook);
function addWebhook(opt, fn) {
   this.wufoo.webhook().add(this.hash, opt, fn);
}

Form.prototype.deleteWebhook = deleteWebhook;
Form.prototype.deleteWebhookAsync = util.promisify(deleteWebhook);
function deleteWebhook(hookid, fn) {
   this.wufoo.webhook().delete(this.hash, hookid, fn);
}

//---------- Report --------
util.inherits(Report, GenericParentEntity);
function Report(wufoo){
   this.wufoo = wufoo;
}

Report.prototype.getWidgets = function() {
   var args = utils.buildArgs.apply(null, arguments);
   this._cacheOrFetch(this.linkWidgets, "Widgets", args.params, args.fn);
}

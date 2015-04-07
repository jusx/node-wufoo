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


// get all the forms for this account/subdomain.
Wufoo.prototype.getForms = function(fn) {
   this._getObjects("forms", null, fn, "Forms", Form);
}

// get the form given the id/hash.
Wufoo.prototype.getForm = function(id, fn) {
   this._getObjects("forms/" + id, null, fn, "Forms", Form, true);
}

// get all the form entries given the form id/hash.
Wufoo.prototype.getFormEntries = function(id, fn) {
   this._getObjects("forms/" + id + "/entries", null, fn, "Entries", GenericEntity);
}

// get all the form entries given the form id/hash.
Wufoo.prototype.getFormEntriesById = function(id, entryId, fn) {
   this._getObjects("forms/" + id + "/entries", '?Filter1=EntryId+Is_equal_to+' + entryId, fn, "Entries", GenericEntity);
}

// get all the reports for this account/subdomain.
Wufoo.prototype.getReports = function(fn) {
   this._getObjects("reports", null, fn, "Reports", Report);
}

// get the report given the report id.
Wufoo.prototype.getReport = function(id, fn) {
   this._getObjects("reports/" + id, null, fn, "Reports", Report, true);
}

// get all the form entries given the report id/hash.
Wufoo.prototype.getReportEntries = function(id, fn) {
   this._getObjects("reports/" + id + "/entries", null, fn, "Entries", GenericEntity);
}

// get the form fields given the form id/hash.
Wufoo.prototype.getFields = function(id, fn) {
   this._getObjects("forms/" + id + "/fields", null, fn, "Fields", GenericEntity);
}

// get the widgets from wufoo given the reportid/hash.
Wufoo.prototype.getWidgets = function(id, fn) {
   this._getObjects("reports/" + id + "/widgets", null, fn, "Widgets", GenericEntity);
}

// get form comments given form id/hash
Wufoo.prototype.getComments = function(id, fn) {
   this._getObjects("forms/" + id + "/comments", null, fn, "Comments", GenericEntity);
}

// get the count for the comments of a form given the id/hash.
Wufoo.prototype.getCommentCount = function(id, fn) {
   this._getMethod("forms/" + id + "/comments/count", function(err, json) {
      fn(err, Number(json.Count));
   });
}

// returns the WebHook object
Wufoo.prototype.webhook = function() {
   if (this.webhookCache == undefined) this.webhookCache = new WebHook(this);
   return this.webhookCache;
}

// helper method for doing a get.
Wufoo.prototype.get = function (uri, fn) {
   this.request("GET", uri, fn);
}

// This is a utility method to make API calls to Wufoo. i.e. https://{subdomain}.wufoo.com/api/v3
// It takes care of authentication. Callback function will receive two parameters the http error if any and the object representation of the json returned from Wufoo.
// method: GET, POST, PUT, etc.
//    uri: full uri
//     fn: callback function.
Wufoo.prototype.request = function(method, uri, params, fn) {

   var options = {
      json: true,
      uri: uri,
      method: method.toUpperCase(),
      headers: {
         "Authorization" : "Basic " + new Buffer(this.apiKey + ":footastic").toString("base64")
      }
   }

   if (fn!=undefined && params !=undefined) options["form"] = params; // params for form post was passed in.
   if (fn == undefined && params != undefined) fn = params; // no params was passed in. In which case it is fn callback.

   util.debug(method.toUpperCase() + " " + uri);
   request(options, function(err, res, json) {
      if (err){util.debug(err);}
      fn(err, json);
   });
}

// ----- internal helper methods. ------
Wufoo.prototype._getObjects = function(path, querystring, fn, jsonType, klass, firstElm) {
   var self = this;
   this._getMethod(path, querystring, function(err, json) {
      objects =  utils.cloneObjects(eval("json." + jsonType), function(){return new klass(self);});
      fn(err, (firstElm)? objects[0] : objects);
   });
}

Wufoo.prototype._getMethod = function (method, querystring, fn) {
   this.get(this._toUri(method, querystring), fn);
}

Wufoo.prototype._toUri = function(path, querystring) {
   return this.url + path + ".json" + (querystring || '');
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

Report.prototype.getWidgets = function(fn) {
   this._cacheOrFetch(this.linkWidgets, "Widgets", fn);
}

var request = require("request");
var util = require("util");
module.exports = Wufoo;


//---------- Wufoo ----------
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


/**
 * Fetches all the forms.
 * @return {Array} Array of {Form} forms for the account.
 * @param {Function} fn callback.
 */
Wufoo.prototype.getForms = function(fn) {
   this._getObjects("forms", fn, "Forms", Form);
}

/**
 * Fetches the Form given the identifier.
 * @param {String} id of the Form
 * @param {Function} fn callback.  
 */
Wufoo.prototype.getForm = function(id, fn) {
   this._getObjects("forms/" + id, fn, "Forms", Form, true);
}

/**
 * @return {Array} Array of entries for given the form id.
 * @param {String} id id of the form.
 * @param {Function} fn callback.
 */
Wufoo.prototype.getFormEntries = function(id, fn) {
   this._getObjects("forms/" + id + "/entries", fn, "Entries", GenericEntity);
}

/**
 * @return {Array} Array of reports for the account.
 * @param {Function} fn callback.
 */
Wufoo.prototype.getReports = function(fn) {
   this._getObjects("reports", fn, "Reports", Report);
}

/**
 * Fetches the Report given the identifier.
 * @param {String} id of the Form
 * @param {Function} fn callback.  
 */
Wufoo.prototype.getReport = function(id, fn) {
   this._getObjects("reports/" + id, fn, "Reports", Report, true);
}


/**
 * Fetches all the entries for the report given the reportId.
 * @param {int} id of the Report.
 * @param {Function} fn callback.
 */
Wufoo.prototype.getReportEntries = function(id, fn) {
   this._getObjects("reports/" + id + "/entries", fn, "Entries", GenericEntity);
}


/**
 * Fetches all the fields for a given form id.
 * @param {int} id of the Form.
 * @param {Function} fn callback.
 */
Wufoo.prototype.getFields = function(id, fn) {
   this._getObjects("forms/" + id + "/fields", fn, "Fields", GenericEntity);
}

/**
 * This is a utility method to make API calls to Wufoo. i.e. https://{subdomain}.wufoo.com/api/v3/reports.{xml|json}
 * It takes care of authentication. Callback function is passed two parameters the http error if any and the object representation of the json returned from Wufoo.
 * 
 */
Wufoo.prototype.get = function (uri, fn) {
   var options = {
      uri: uri,
      method: "GET",
      headers: {
         "Authorization" : "Basic " + new Buffer(this.apiKey + ":footastic").toString("base64")
      }
   }
   util.debug("Fetching " + uri);
   request(options, function(err, res, body) { 
      if (err){util.debug(err);}
      fn(err, JSON.parse(body));
   });
}

// ----- internal helper methods. ------
Wufoo.prototype._getObjects = function(path, fn, jsonType, klass, firstElm) {
   var self = this;
   this._getMethod(path, function(err, json) {
      objects =  _cloneObjects(eval("json." + jsonType), function(){return new klass(self);});
      fn(err, (firstElm)? objects[0] : objects);
   });
}

Wufoo.prototype._getMethod = function (method, fn) {
   this.get(this.url + method + ".json", fn);
}

//---------- Generics ---------
function GenericParentEntity(wufoo) {
   this.wufoo = wufoo;
}

GenericParentEntity.prototype.getFields = function(fn) {
   var self = this;
   if (this.fields == undefined) {
      this.wufoo.get(this.linkFields, function(err, json) {
         self.fields = _cloneObjects(json.Fields, function() {return new GenericEntity(self.wufoo)});
         fn(err, self.fields);
      });
   } else {
      fn(null, this.fields);
   }
}

GenericParentEntity.prototype.getEntries = function (fn) {
   var self = this;
   if (this.entries == undefined) {
      this.wufoo.get(this.linkEntries, function(err, json) {
         self.entries = _cloneObjects(json.Entries, function() {return new GenericEntity(self.wufoo)});
         fn(err, self.entries);
      });
   } else {
      fn(null, this.entries);
   }
}

GenericParentEntity.prototype.getEntriesCount = function(fn) {
   var self = this;
   if (this.entriesCount == undefined) {
      this.wufoo.get(this.linkEntriesCount, function(err, json) {
         self.entriesCount = Number(json.EntryCount);
         fn(err, self.entriesCount);
      });
   } else {
      fn(null, this.entriesCount);
   }
}

function GenericEntity(wufoo) {
   this.wufoo = wufoo;
}

//---------- Form ----------
util.inherits(Form, GenericParentEntity);
function Form(wufoo) {
   this.wufoo = wufoo;
}

//---------- Report --------
util.inherits(Report, GenericParentEntity);
function Report(wufoo){
   this.wufoo = wufoo;
}

Report.prototype.getWidgets = function(fn) {
   var self = this;
   if (this.widgets == undefined) {
      this.wufoo.get(this.linkWidgets, function(err, json) {
         self.widgets = _cloneObjects(json.Widgets, function() {return new GenericEntity(self.wufoo)});
         fn(err, self.widgets);
      });
   } else {
      fn(null, this.entriesCount);
   }
}





// --------- Utility Functions. --------

// Copy an array of json to an array of objects as constructed by the Factory:
//    - Ensure properties with prefix "is" returns a boolean. 
//    - Make all properties camelcase.
// 
// @params {Array} Objects to clone.
// @params {Function} Factory of the object. This Function must return a new instantiated object to have the properties copied to.
function _cloneObjects(objects, factory) {
   var retarr = new Array();
   for (var i =0; i < objects.length; i++) {
      var obj = objects[i];
      var ret = factory();
      for (var prop in obj) {
         var val = obj[prop];
         // Semantics. Camelcase properties please. JSON returned from Wufoo is titlecase properties.
         var propName = (prop.match(/[A-Z]/g).length <= 1 || prop.match("ID"))? prop.toLowerCase() :  prop.charAt(0).toLowerCase() + prop.slice(1);
         ret[propName] = (Object.prototype.toString.call( val ) === '[object Array]')? _cloneObjects(val, function(){return {}}) : val;
      }
      retarr.push(ret);
   }
   return retarr;
}

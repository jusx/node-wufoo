/**
 * Generic Object Wrappers for Wufoo JSON.
 */
var utils = require("./utils.js");

module.exports = {
   GenericParentEntity: GenericParentEntity,
   GenericEntity: GenericEntity
}

// A Generic object that has methods for getting it's children. i.e. Form, Report, etc.
function GenericParentEntity(wufoo) {
   this.wufoo = wufoo;
}

GenericParentEntity.prototype.getFields = function() {
   var args = utils.buildArgs.apply(null, arguments);
   this._cacheOrFetch(this.linkFields, "Fields", args.params, args.fn);
}

GenericParentEntity.prototype.getEntries = function () {
   var args = utils.buildArgs.apply(null, arguments);
   this._cacheOrFetch(this.linkEntries, "Entries", args.params, args.fn);
}

GenericParentEntity.prototype.getEntriesCount = function() {
   var self = this;
   var args = utils.buildArgs.apply(null, arguments);
   this._cacheOrAction("entriesCount", args.fn, function(){
      self.wufoo.get(self.linkEntriesCount, args.params, function(err, json) {
         self.entriesCount = Number(json.EntryCount);
         args.fn(err, self.entriesCount);
      });
   });
}

// execute an "action method" only if the local property is undefined. Basically use this to ensure lazy caching.
GenericParentEntity.prototype._cacheOrAction = function(propName, fn, action) {
   var self = this;
   if (this[propName] == undefined) {
      action();
   } else {
      fn(null, this[propName]);
   }
}

// wrapper for fetching objects from wufoo cacheOrAction is called to check for local copy existence first.
GenericParentEntity.prototype._cacheOrFetch = function(link, propName, params, fn) {
   var self = this;
   var thisProp = propName.toLowerCase();

   this._cacheOrAction(thisProp, fn, function() {
      self.wufoo.get(link, params, function(err, json) {
        self[thisProp] = utils.cloneObjects(json[propName], function() {return new GenericEntity(self.wufoo)});
        fn(err, self[thisProp]);
      });
   });
}

// A Generic Child Entity. i.e. Field, Entry, etc.
function GenericEntity(wufoo) {
   this.wufoo = wufoo;
}

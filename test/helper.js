var should = require("should");
var Wufoo = require("../");
module.exports = new helper(); 

// helpers.
function helper() {
   this.wufoo = new Wufoo("fishbowl", "AOI6-LFKL-VM1Q-IEX9");
   
}
helper.prototype.isEntry = isEntry;
helper.prototype.isField = isField;
helper.prototype.isWidget = function(widget) {
   for (prop in ["names", "size", "hash", "type", "typeDesc"]) {
      should.exist(widget[prop]);
   }
}

helper.prototype.isComment = function(comment ) {
   for (prop in ["commentId", "entryId", "text", "commentedBy", "dateCreated"]) {
      should.exist(comment[prop]);
   }
}

function isEntry(entry) {
   // TODO refactor to test for all attributes.
   should.exist(entry.entryId);
   should.exist(entry.createdBy);
}

function isField(field) {
   // TODO refactor to test for all attributes.
   should.exist(field.id);
   should.exist(field.title);
   should.not.exist(field.startDate);
   should.not.exist(field.endDate);
}






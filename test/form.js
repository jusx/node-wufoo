var should = require("should");
var helper = require("./helper.js");


describe("Form", function() {
   var $form;
   
   before(function(done) {
      helper.wufoo.getForms(function(err, forms){
         $form = forms[0];
         done(err);
      });
   })
   
   describe("#getEntries", function() {
      it("Should return array of entries", function(done){
         $form.getEntries(function(err, entries){
            (entries.constructor == Array).should.be.true;
            helper.isEntry(entries[0]);
            done(err);
         }); 
      })
      
   });
   
   describe("#getFields", function() {
      it("Should return array of fields", function(done){
         $form.getFields(function(err, fields){
            (fields.constructor == Array).should.be.true;
            helper.isField(fields[0]);
            done(err);
         }); 
      })
      
      
   });
   
   describe("#getEntriesCount", function() {
      it("Should return a number", function(done) {
         $form.getEntriesCount(function(err, count) {
            (typeof(count)).should.be.equal("number");
            done(err);
         });
      });
   });
   
   
})
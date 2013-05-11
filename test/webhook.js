var should = require("should");
var util = require("util");
var helper = require("./helper.js");
var WebHook = require("../lib/webhook.js");

describe("WebHook", function() {
   var $form;
   var ids = [];
   
   before(function(done) {
      helper.wufoo.getForms(function(err, forms){
         $form = forms[0];
         done(err);
      });
   })
   
   describe("#add", function(done) {
      it("Should get a hash id back from Wufoo", function(done){
         helper.wufoo.webhook().add($form.hash, "http://localhost:3000", function(err, hashid) {
            should.exist(hashid);
            ids.push(hashid); // store for cleanup.
            done(err);
         })
      })
   });
   
   // In a way we are indirectly testing delete. So there won't be a specific test for it.
   after(function(done) {
      for (var i=0; i<ids.length; i++) {
         id = ids[i]
         helper.wufoo.webhook().delete($form.hash, id, function(err, success) {
            success.should.be.true;
            util.debug("Removed Webhook: " + id);
         });
      }
      done();
   });
})
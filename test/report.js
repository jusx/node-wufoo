var should = require("should");
var helper = require("./helper.js");
var util = require("util");


describe("Report", function() {
   var $report;
   
   before(function(done) {
      helper.wufoo.getReports(function(err, reports){
         $report = reports[0];
         done(err);
      });
   })
   
   describe("#getWidgets", function() {
      it("Should return array of widgets", function(done){
         $report.getWidgets(function(err, widgets){
            (widgets.constructor == Array).should.be.true;
            if (widgets.length>0) {
               // TODO -- the fishbowl account we are using for testing do not have any widgets.
               // Must find a way for better test coverage.
               util.debug("Testing Widget Entity");
               helper.isWidget(widgets[0]);
            }
            done(err);
         }); 
      })
      
   });
})
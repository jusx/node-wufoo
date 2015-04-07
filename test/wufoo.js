var should = require("should");
var util = require("util");
var helper = require("./helper.js");

describe("Wufoo", function() {
   
   var $wufoo= helper.wufoo;
   describe("#getForms", function() {
      it("Should return forms without error", function(done) {
         $wufoo.getForms(function(err, forms){
            should.not.exist(err);
            should.exist(forms);
            (forms.length > 0).should.be.true;
            done(err);
         });
      });
      
      it("Should return array of objects containing typical wufoo form attributes", function(done) {
         $wufoo.getForms(function(err, forms){
            form = forms[0];
            should.exist(form.hash);
            should.exist(form.language);
            should.exist(form.startDate);
            should.exist(form.endDate);
            should.exist(form.getEntries);
            done(err);
         });
      });
   });


   describe("#getForm", function(){
      it("Should return the right form given the hash", function(done) {
         $wufoo.getForms(function(err, forms){
            var hash = forms[0].hash;
            $wufoo.getForm(hash, function(err, form) {
               form.hash.should.equal(hash);
               done(err);
            });
         });
      })
   });
   
   describe("#getFields", function() {
      var formId;
      
      before(function(done){
         $wufoo.getForms(function(err, forms){
            formId = forms[0].hash;
            done(err);
         })
      });
      
      
      it("Should return an array that's not empty.", function(done){
         $wufoo.getFields(formId, function(err, fields) {
            should.not.exist(err);
            should.exist(fields);
            (fields.length > 0).should.be.true;
            done(err);
         });
      });
      
      it("Should return an array Objects that are Fields.", function(done){
         $wufoo.getFields(formId, function(err, fields) {
            helper.isField(fields[0]);
            done(err);
         });
      });
   });
   
   describe("#getFormEntries", function() {
      var formId;
      before(function(done){
         $wufoo.getForms(function(err, forms){
            formId = forms[0].hash;
            done(err)
         })
         
      })
      
      it("Should return entries without error", function(done) {
         $wufoo.getFormEntries(formId, function(err, entries){
            should.not.exist(err);
            should.exist(entries);
            (entries.length > 0).should.be.true;
            done(err);
         });
      });
      
      it("Should return array of objects containing typical wufoo entry attributes", function(done) {
         $wufoo.getFormEntries(formId, function(err, entries){
            helper.isEntry(entries[0]);
            done(err);
         });
      });
   });

   describe("#getFormEntriesById", function() {
      var formId;
      var entryId;
      before(function(done){
         $wufoo.getForms(function(err, forms){
            formId = forms[0].hash;
            $wufoo.getFormEntries(formId, function(err, entries){
               entryId = entries[0].entryId;
               done(err);
            });
         })
      })

      it("Should return entries without error", function(done) {
         $wufoo.getFormEntriesById(formId, entryId, function(err, entries){
            should.not.exist(err);
            should.exist(entries);
            (entries.length > 0).should.be.true;
            entries[0].entryId.should.equal(entryId.toString());
            done(err);
         });
      });

      it("Should return array of objects containing typical wufoo entry attributes", function(done) {
         $wufoo.getFormEntriesById(formId, entryId, function(err, entries){
            helper.isEntry(entries[0]);
            done(err);
         });
      });
   });

   describe("#getReportEntries", function() {
      var reportId;
      before(function(done){
         $wufoo.getReports(function(err, reports){
            reportId = reports[0].hash;
            done(err)
         })
         
      })
      
      it("Should return entries without error", function(done) {
         $wufoo.getReportEntries(reportId, function(err, entries){
            should.not.exist(err);
            should.exist(entries);
            (entries.length > 0).should.be.true;
            done(err);
         });
      });
      
      it("Should return array of objects containing typical wufoo entry attributes", function(done) {
         $wufoo.getReportEntries(reportId, function(err, entries){
            helper.isEntry(entries[0]);
            done(err);
         });
      });
   });
   
   describe("#getReports", function() {
      it("Should return reports without error", function(done) {
         $wufoo.getReports(function(err, reports){
            should.not.exist(err);
            should.exist(reports);
            (reports.length > 0).should.be.true;
            done(err);
         });
      });
      
      it("Should return array of objects containing typical wufoo Report attributes", function(done) {
         $wufoo.getReports(function(err, reports){
            report = reports[0];
            should.exist(report.hash);
            should.exist(report.name);
            should.exist(report.url);
            should.exist(report.dateCreated);
            should.exist(report.dateUpdated);
            should.exist(report.getWidgets);
            done(err);
         });
      });
   });
   
   describe("#getReport", function(){
      it("Should return a Report given the hash", function(done) {
         $wufoo.getReports(function(err, reports){
            var hash = reports[0].hash;
            $wufoo.getReport(hash, function(err, report) {
               report.hash.should.equal(hash);
               done(err);
            });
         });
      })
   });
   
   describe("#getWidgets", function(){
      var reportId;
      before(function(done){
         $wufoo.getReports(function(err, reports){
            reportId = reports[0].hash;
            done(err)
         })
         
      })
      
      it("Should return an Array of Widgets given the hash", function(done) {
         $wufoo.getWidgets(reportId, function(err, widgets){
            (widgets instanceof Array).should.be.true;
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
   
   describe("#getFormComments", function(){
      // TODO find a way to mock up wufoo responses so that we have the dataset we need for testing!
      var id;
      before(function(done){
         $wufoo.getForms(function(err, forms){
            for (var i=0;i<forms.length;i++) {
               form = forms[i];
               $wufoo.getCommentCount(forms[i].hash, function(err, count) {
                  if (count >0) {
                     id = form.hash;
                  }
               });
             }
            id = (id==undefined)? forms[0].hash : id;
            done(err)
         })
         
      })
      
      it("Should return an Array of Comments given the hash", function(done) {
         $wufoo.getComments(id, function(err, comments){
            (comments instanceof Array).should.be.true;
            if (comments.length>0) {
               // TODO -- the fishbowl account we are using for testing do not have any widgets.
               // Must find a way for better test coverage.
               util.debug("Testing Comment Entity");
               helper.isComment(comment[0]);
            }
            done(err);
         });
      })
   });
});


# Node-Wufoo 

Node-Wufoo is a [Wufoo API] (http://www.wufoo.com/docs/api/v3/) wrapper for [node.js] (http://nodejs.org/). It simplifies working with the Wufoo API and provides an abstraction layer.

## Installation

    $ npm install wufoo
   
## Usage

Each API returns it's own set of objects which is all documented on [Wufoo.com] (http://www.wufoo.com/docs/api/v3/) for reference. 

### Example

```javascript
   var Wufoo = require("wufoo");
   var wufoo = new Wufoo("fishbowl", "AOI6-LFKL-VM1Q-IEX9");
   
   wufoo.getForms(function(err, forms) {
      // do something with your forms here.
   });
   
   // get a specific form given the id.
   wufoo.getForm("idofForm", function(err, form){
      // do something with your form here.
   });
   
   wufoo.getFormEntries("idofForm", function(err, entries) {
      // do something with your entries here.
   });
```   

### Forms

Get all the forms for an account. <code>getForms</code> returns an array of <code>Form</code> objects. You can also call <code>getForm</code> to get a specific <code>Form</code>.

```javascript

   wufoo.getForms(function(err, forms) {
      console.log(form.hash);
      console.log(form.name);
      console.log(form.description);
      // do something here.
   });
   
   // get a specific form given the id.
   wufoo.getForm("idofForm", function(err, form){
      // do something here.
   });
   
```   

Convenience methods are provided to get entries, fields and entry count for a <code>Form</code>:

```javascript

   form.getEntries(function(err, entries) {
     // do something here.
   });
   
   form.getEntriesCount(function(err, count) {
      // do something here.
      console.log("There are " + count + " number of entries");
    });
   
    form.getFields(function(err, fields) {
        // do something here.
    });
```   


### Entries

Get all the entries for a form or report. <code>getFormEntries</code> and <code>getReportEntries</code> returns an array of <code>Entry</code> objects.

```javascript

   wufoo.getFormEntries(formid, function(err, entries) {
      // do something here.
   });

   wufoo.getReportEntries(reportid, function(err, entries) {
      // do something here.
   });
   
```   

### Reports

Get all the reports for an account. <code>getReports</code> returns an array of <code>Report</code> objects.

```javascript

   wufoo.getReports(function(err, reports) {
      // do something here
   });
   
   // get a specific form given the id.
   wufoo.getReport("idofReport", function(err, report){
      // do something here.
   });
   
```   
Convenience methods are provided to get entries, fields and entry count for a Report:

```javascript

   report.getEntries(function(err, entries) {
     // do something here.
   });
   
   report.getEntriesCount(function(err, count) {
      // do something here.
      console.log("There are " + count + " number of entries");
    });
   
    report.getFields(function(err, fields) {
      // do something here.
    });
```   



### Fields
Get all the reports for a form. <code>getFields</code> returns an array of <code>Field</code> objects.

```javascript

   wufoo.getFields(formid, function(err, fields) {
      // do something here.
   });
   
```

### Widgets
Get all the widgets for a report. <code>getWidgets</code> returns an array of <code>Widget</code> objects.

```javascript

   wufoo.getWidgets(reportid, function(err, widgets) {
      // do something here.
   });
   
```

### Comments
Get all the comments for a form. <code>getComments</code> returns an array of <code>Comment</code> objects.

```javascript

   wufoo.getComments(formid, function(err, comments) {
      // do something here.
   });
   
```

Alternatively if all you need is the amount of comments for a form you can call <code>getCommentCount</code>:
```javascript

   wufoo.getCommentCount(formid, function(err, count) {
      // do something here.
   });
   
```

### WebHooks
Add a [WebHook] (http://www.wufoo.com/docs/api/v3/webhooks/put/) for a form:

```javascript
  
   wufoo.webhook().add("formid", "http://localhost:3000", function(err, hashid) {
     // store the webhook hashid somewhere in case we want to delete them later.
   })
   
   // pass in optional options
   var options = {url: "http://abc.com/webhook", handshakeKey: "hand-shaking", metadata: true}
   wufoo.webhook().add("formid", options, function(err, hashid) {
     // store the webhook hashid somewhere in case we want to delete them later.
     db.put("WebHooks", {formid:form.hash, key:hashid});
   })
```

Delete the WebHook. [More info] (http://www.wufoo.com/docs/api/v3/webhooks/delete/):
   
```javascript   
   wufoo.webhook().delete("formid", "webhookHashId", function(err, success) {
     if (!success) {
       // do something.
     }
      
   })
   
```

Helper methods are also provided on the <code>Form</code> object:


   ```javascript   
      form.addWebhook("http://localhost:3000", function(err, hashid) {
         // store the webhook hashid somewhere in case we want to delete them later.
       })
      
   
      form.deleteWebhook("webhookHashId", function(err, success) {
        if (!success) {
          // do something.
        }

      })

   ```


## Contributions

Please fork it. Add new features or fix bugs and do a pull request. Tests should be included:

- Fork it
- Create your feature branch (<code>git checkout -b feature-new-stuff</code>).
- Commit your changes (<code>git commit -am 'Added some feature'</code>).
- Push to the branch (<code>git push origin feature-new-stuff</code>).
- Create new Pull Request.

### Testing
Be sure to have [mocha](http://visionmedia.github.io/mocha/) installed. Run the entire test suite from the root directory of the project:
        
    $ mocha

## Future Versions
Node-Wufoo implements almost all of the Wufoo RESTful API except the following: 

- Updating Entries ([POST API] (http://www.wufoo.com/docs/api/v3/entries/post/)).
- [Login] (http://www.wufoo.com/docs/api/v3/login/).

Implementation and support of the above will be included in future versions. 
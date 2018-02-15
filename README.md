![Build](https://circleci.com/gh/jusx/node-wufoo.svg?style=shield&circle-token=3c6bf745453828aa4cc23daf7befe363287e0b97)
[![npm version](https://img.shields.io/npm/v/wufoo.svg)](https://www.npmjs.com/package/wufoo)

# Node-Wufoo

Node-Wufoo is a [Wufoo API](http://www.wufoo.com/docs/api/v3/) wrapper for [node.js](http://nodejs.org/). It simplifies working with the Wufoo API and provides an abstraction layer.

## Installation

    $ npm install wufoo

## Usage

Each API returns it's own set of objects which is all documented on [Wufoo.com](http://www.wufoo.com/docs/api/v3/) for reference.

The required node version is `8.0.0` and above for all releases above `v1.2.x`.

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

   // pass in optional query parameters
   var optionalQuery = {pretty: true}

   wufoo.getForms(optionalQuery, function(err, forms) {
      // do something with your forms here.
   });

   // get a specific form given the id and pass in optional query parameters
   wufoo.getForm("idofForm", optionalQuery, function(err, forms) {
      // do something with your forms here.
   });

   wufoo.getFormEntries("idofForm", optionalQuery, function(err, entries) {
      // do something with your entries here.
   });
```   

### Forms

Get all the forms for an account. <code>getForms</code> returns an array of <code>Form</code> objects. You can also call <code>getForm</code> to get a specific <code>Form</code>.

```javascript

   wufoo.getForms(function(err, forms) {
      console.log(forms[0].hash);
      console.log(forms[0].name);
      console.log(forms[0].description);
      // do something here.
   });

   // get a specific form given the id.
   wufoo.getForm("idofForm", function(err, form){
      // do something here.
   });

   // pass in optional query parameters
   var optionalQuery = {pretty: true}

   wufoo.getForms(optionalQuery, function(err, forms) {
      console.log(forms[0].hash);
      console.log(forms[0].name);
      console.log(forms[0].description);
      // do something here.
   });

   // get a specific form given the id and pass in optional query parameters
   wufoo.getForm("idofForm", optionalQuery, function(err, forms) {
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

    // pass in optional query parameters
    var optionalQuery = {pretty: true}

    form.getEntries(optionalQuery, function(err, entries) {
      // do something here.
    });

    form.getEntriesCount(optionalQuery, function(err, count) {
       // do something here.
       console.log("There are " + count + " number of entries");
     });

     form.getFields(optionalQuery, function(err, fields) {
         // do something here.
     });
```   


### Entries

Get all the entries for a form or report. <code>getFormEntries</code> and <code>getReportEntries</code> returns an array of <code>Entry</code> objects.

```javascript

   wufoo.getFormEntries("formid", function(err, entries) {
      // do something here.
   });

   wufoo.getReportEntries("reportid", function(err, entries) {
      // do something here.
   });

   // pass in optional query parameters
   var optionalQuery = {pretty: true}

   wufoo.getFormEntries("formid", optionalQuery, function(err, entries) {
      // do something here.
   });

   wufoo.getReportEntries("reportid", optionalQuery, function(err, entries) {
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

   // pass in optional query parameters
   var optionalQuery = {pretty: true}

   wufoo.getReports(optionalQuery, function(err, reports) {
      // do something here
   });

   // get a specific form given the id.
   wufoo.getReport("idofReport", optionalQuery, function(err, report){
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

    // pass in optional query parameters
    var optionalQuery = {pretty: true}

   report.getEntries(optionalQuery, function(err, entries) {
     // do something here.
   });

   report.getEntriesCount(optionalQuery, function(err, count) {
     // do something here.
     console.log("There are " + count + " number of entries");
    });

    report.getFields(optionalQuery, function(err, fields) {
      // do something here.
    });   
```   



### Fields
Get all the reports for a form. <code>getFields</code> returns an array of <code>Field</code> objects.

```javascript

   wufoo.getFields("formid", function(err, fields) {
      // do something here.
   });

   // pass in optional query parameters
   var optionalQuery = {pretty: true}

   wufoo.getFields("formid", optionalQuery, function(err, fields) {
      // do something here.
   });

```

### Widgets
Get all the widgets for a report. <code>getWidgets</code> returns an array of <code>Widget</code> objects.

```javascript

   wufoo.getWidgets("reportid", function(err, widgets) {
      // do something here.
   });

   // pass in optional query parameters
   var optionalQuery = {pretty: true}

   wufoo.getWidgets("reportid", optionalQuery, function(err, widgets) {
      // do something here.
   });

```

### Comments
Get all the comments for a form. <code>getComments</code> returns an array of <code>Comment</code> objects.

```javascript

   wufoo.getComments("formid", function(err, comments) {
      // do something here.
   });

   // pass in optional query parameters
   var optionalQuery = {pretty: true}

   wufoo.getComments("formid", optionalQuery, function(err, comments) {
      // do something here.
   });

```

Alternatively if all you need is the amount of comments for a form you can call <code>getCommentCount</code>:
```javascript

   wufoo.getCommentCount("formid", function(err, count) {
      // do something here.
   });

   // pass in optional query parameters
   var optionalQuery = {pretty: true}

   wufoo.getCommentCount("formid", optionalQuery, function(err, count) {
      // do something here.
   });

```

### WebHooks
Add a [WebHook](http://www.wufoo.com/docs/api/v3/webhooks/put/) for a form:

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

Delete the WebHook. [More info](http://www.wufoo.com/docs/api/v3/webhooks/delete/):

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
### Promises
Every single API documented above have an alternate version that supports promises. For the preferred method of using promises or await/async instead of callbacks append `Async` to the end of the function name. For example, the following are all valid:

- `from.addWebhookAsync`
- `wufoo.getCommentCountAsync`
- `wufoo.getWidgetsAsync`

And so on. Calling `wufoo.getCommentCountAsync` will be as follows:

```js

   wufoo.getCommentCount("formid")
      .then ((count) => {
         console.log(count);
      })
      .catch((err) => {
         console.log(err);
      });

```

## Contributions

Please fork it. Add new features or fix bugs and do a pull request. Tests should be included:

- Fork it
- Create your feature branch (<code>git checkout -b feature-new-stuff</code>).
- Commit your changes (<code>git commit -am 'Added some feature'</code>).
- Push to the branch (<code>git push origin feature-new-stuff</code>).
- Create new Pull Request.

### Testing
Be sure to have [mocha](http://mochajs.org/) installed.  Run the entire test suite from the root directory of the project by running the command:

```
   $ mocha
```
   or

```
   $ npm test
```

## Future Versions
Node-Wufoo implements all of the Wufoo RESTful API except the following:

- Updating Entries ([POST API](http://www.wufoo.com/docs/api/v3/entries/post/)).
- [Login](http://www.wufoo.com/docs/api/v3/login/).

Implementation and support of the above will be included in future versions. Contributions welcome!

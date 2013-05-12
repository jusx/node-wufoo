module.exports = WebHook;

function WebHook(wufoo) {this.wufoo = wufoo;}

// pass in a url or options: {url:"foo", handshakeKey:"jkey", metadata:true}, id is the identifier of the form.
WebHook.prototype.add = function(id, paramsOrUrl, fn) {
   if (typeof(paramsOrUrl) == "string") {
      form = {url:paramsOrUrl};
   } else {
      form = paramsOrUrl;
   }
   this.wufoo.request("put", this.wufoo._toUri("forms/" + id + "/webhooks"), form, function(err, json) {
      fn(err, json.WebHookPutResult.Hash);
   });
}

// remove the webhook given the id
// returns true delete was successful!
WebHook.prototype.delete = function(formid, hashId, fn) {
   this.wufoo.request("delete", this.wufoo._toUri("forms/" + formid + "/webhooks/" + hashId), function(err, json) {
      fn(err, (json.WebHookDeleteResult.Hash == hashId));
   });
}
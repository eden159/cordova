/* globals fetch: false, Promise: true*/
Promise = require("promise");
require("whatwg-fetch");

//the main URL for the API
var apiEndpoint = '';

var apiModule = function() {
};

apiModule.prototype.create = function() {
    return this;
};

//login for an user
apiModule.prototype.login = function(email, password, callbacks) {

    var data = new FormData();
    //data.append('file', input.files[0]);
    data.append('email', email);
    data.append('password', password);

    // Run async remote request with fetch
    fetch(apiEndpoint+"login", {
        method: 'post',
        headers: {
            'Accept': 'application/json'
        },
        body: data
    }).then(function(response) {
        return response.json();
    }).catch(function(err) {

        callbacks.fail(err);
    }).then(function(json) {

        callbacks.success(json);
    });

    return this;
};

module.exports = apiModule;

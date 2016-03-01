/* globals fetch: false, Promise: true*/
Promise = require("promise");
require("whatwg-fetch");

var settings = require("./config.json");

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
    fetch(settings.api_url+"login", {
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

//logout an user
apiModule.prototype.logout = function(callbacks) {

    // Run async remote request with fetch
    fetch(settings.api_url+"logout", {
        method: 'post',
        headers: {
            'Accept': 'application/json'
        }
    }).then(function(response) {
        return response.json();
    }).catch(function(err) {

        callbacks.fail(err);
    }).then(function(json) {

        callbacks.success(json);
    });

    return this;
};

//get the competitions
apiModule.prototype.getCompetitions = function(token, callbacks) {

    // Run async remote request with fetch
    fetch(settings.api_url+"competitions", {
        method: 'post',
        headers: {
            'Accept': 'application/json',
            'Token': token
        }
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

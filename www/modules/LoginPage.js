var loginPage = function() {
    //every page should have an id
    this.pageId = "loginPage";
    this.successCallback = false;
    this.failCallback = false;

    this.page = tabris.create("Page", {id: this.pageId, topLevel: true});

    //the email field
    tabris.create("TextInput", {
        keyboard: "email",
        id: "txtEmail",
        layoutData: {top: 20, left: 5, right: 5}
    }).appendTo(this.page);

    //the password field
    tabris.create("TextInput", {
        type: "password",
        id: "txtPassword",
        layoutData: {top: ["#txtEmail", 10], left: 5, right: 5}
    }).appendTo(this.page);

    //the submit button
    tabris.create("Button", {
        id: "btnLogin",
        layoutData: {top: ["#txtPassword", 10], left: 5, right: 5}
    }).on("select", function() {

        var api = require("./ApiModule");

        api.login(this.page.children('#txtEmail')[0], this.page.children('#txtPassword')[0], {
            "success": function(loginData) {
                if (this.successCallback !== false) {
                    this.successCallback(loginData);
                }
            },
            "fail": function(error) {

                if (this.failCallback !== false) {
                    this.failCallback(error);
                }
            }
        });

    }).appendTo(this.page);

    //apply the translations
    var TranslationModule = require("./TranslationModule");
    this.page.apply(new TranslationModule(this.pageId));

    return this;
};

loginPage.prototype.open = function(successCalback, failCallback) {

    this.successCallback = successCalback;
    this.failCallback = failCallback;
    this.page.open();
};

module.exports = loginPage;
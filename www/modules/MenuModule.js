tabris.create("Drawer");

var TranslationModule = require("./TranslationModule");
var translation = new TranslationModule('menuModule');

var settings = require("./config.json");

//add the extracted competitions
var db = window.sqlitePlugin.openDatabase({name: settings.sqlite_db, androidLockWorkaround: 1});

//add the logout button
tabris.create("Action", {
    title: translation.logout,
    placementPriority: "low"
}).on("select", function() {

    var api = require("./ApiModule");

    api.logout({
        "success": function(data) {

            if (data.success == true) {
                localStorage.setItem('credentials', false);
            }
        },
        "fail": function(error) {

            console.error(error);
        }
    });
});
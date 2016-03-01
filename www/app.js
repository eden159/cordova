// Wait for Cordova to load
document.addEventListener('deviceready', onDeviceReady, false);

var translation, userCredentials;

//called when we initially want the data
function resetDb() {
    var settings = require("./config.json"), dbError = false;
    var db = window.sqlitePlugin.openDatabase({name: settings.sqlite_db, androidLockWorkaround: 1});

    //initialize the tables
    db.executeSql("DROP TABLE IF EXISTS station_users");
    db.executeSql("DROP TABLE IF EXISTS users");
    db.executeSql("DROP TABLE IF EXISTS stations");
    db.executeSql("DROP TABLE IF EXISTS competitions");
    db.executeSql("CREATE TABLE competitions (id INTEGER PRIMARY KEY, name TEXT NOT NULL)");
    db.executeSql("CREATE TABLE stations (id INTEGER PRIMARY KEY, name TEXT NOT NULL, competition_id INTEGER NOT NULL, FOREIGN KEY(competition_id) REFERENCES competitions(id))");
    db.executeSql("CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT NOT NULL, start_number TEXT)");
    db.executeSql("CREATE TABLE station_users (id INTEGER PRIMARY KEY, station_id INTEGER NOT NULL, user_id INTEGER NOT NULL, FOREIGN KEY(station_id) REFERENCES stations(id), FOREIGN KEY(user_id) REFERENCES users(id))");

    //insert the competition data
    db.transaction(function(tx) {

        //get the initial data from the API
        var api = require("./ApiModule");

        api.getCompetitions(userCredentials.token, {
            "success": function(competitions) {

                for(var i in competitions) {
                    tx.executeSql("INSERT INTO competitions(id, name) values (?, ?)", competitions[i].id, competitions[i].name);
                }
            },
            "fail": function(error) {
                console.error(error);
            }
        });
    }, function(e) {
        console.error(translation.db_error + ' ' + e.message);
    }, function() {
        //transaction was ok
    });
}

// Cordova is ready
function onDeviceReady() {

    var page;

    //check if the user is already logged in
    userCredentials = localStorage.getItem("credentials") || false;

    //no credentials stored or they are expired then we need to login
    if (userCredentials === false || userCredentials.expire <= Math.floor(Date.now() / 1000)) {

        var LoginPage = require("./modules/LoginPage");
        page = new LoginPage();

        page.open(function(loginData) {

            //the passed expire is how many seconds it would need for these credentials to expire
            //so we calculate it base on the local time
            loginData.expire = Math.floor(Date.now() / 1000) + loginData.expire;
            userCredentials = loginData;

            localStorage.setItem('credentials', JSON.stringify(loginData));

            //check if the database is initiated
            if ((localStorage.getItem("initiated") || false) === false) {
                resetDb();
                localStorage.setItem('initiated', true);
            }

            //@todo get the competitions from the API and store them in the SQLite DB

            //@todo open the page to select a competition and close the login page
        }, function (error) {

            //show the error to the user
            console.error(error);
        });
    } else {

        try {
            userCredentials = JSON.parse(userCredentials);
        } catch (ex) {

            //some invalid credetinals
            localStorage.setItem('credentials', false);

            //@todo maybe exit the application
        }
        //tabris.create("Drawer").append(tabris.create("PageSelector"));

        //check if the database is initiated
        if ((localStorage.getItem("initiated") || false) === false) {
            resetDb();
            localStorage.setItem('initiated', true);
        }
    }

    //there is no internet connection then show a message
    if (window.Connection.NONE == navigator.connection.type) {

        //get the translations
        var TranslationModule = require("./TranslationModule");
        translation = new TranslationModule('mainPage');

        console.error(translation.no_connection);
    }
}
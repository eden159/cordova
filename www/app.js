// Wait for Cordova to load
document.addEventListener('deviceready', onDeviceReady, false);

// Cordova is ready
function onDeviceReady() {

    //check if the user is already logged in
    var userCredentialsRaw = localStorage.getItem("credentials") || false;

    var page;

    //no credentials stored or they are expired then we need to login
    if (userCredentialsRaw === false || userCredentialsRaw.expire <= Math.floor(Date.now() / 1000)) {

        var LoginPage = require("./modules/LoginPage");
        page = new LoginPage();

        page.open(function(loginData) {

            //the passed expire is how many seconds it would need for these credentials to expire
            //so we calculate it base on the local time
            loginData.expire = Math.floor(Date.now() / 1000) + loginData.expire;

            localStorage.setItem('credentials', JSON.stringify(loginData));

            //@todo get the competitions from the API and store them in the SQLite DB

            //@todo open the page to select a competition and close the login page
        }, function (error) {

            console.error(error);
        });
    } else {
        //tabris.create("Drawer").append(tabris.create("PageSelector"));
    }

    //there is no internet connection then show a message
    if (window.Connection.NONE == navigator.connection.type) {

        //get the translations
        var TranslationModule = require("./TranslationModule");
        var translation = new TranslationModule('mainPage');

        console.error(translation.no_connection);
    }
}
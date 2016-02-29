//check if the user is already logged in
var userCredentialsRaw = localStorage.getItem("credentials") || false;

if (userCredentialsRaw === false) {

    var LoginPage = require("./modules/LoginPage");
    var page = new LoginPage();

    page.open(function(loginData) {
        localStorage.setItem('credentials', JSON.stringify(loginData));

        //open something else
    }, function (error) {

        console.error(error);
    });
} else {
    //tabris.create("Drawer").append(tabris.create("PageSelector"));
}

//check if the user is already logged in
var userCredentialsRaw = localStorage.getItem("credentials") || false;

if (userCredentialsRaw === false) {

    page = require("./modules/LoginPage");

    page.open(function(loginData) {
        localStorage.setItem('credentials', JSON.stringify(loginData));

        //open something else
    }, function (error) {

        //show an error message
    });
} else {
    //tabris.create("Drawer").append(tabris.create("PageSelector"));
}

page.open();

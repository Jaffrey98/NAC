// var socket = io.connect('192.168.43.29:3000');

var socket = io();

// Initialize app
var myApp = new Framework7();


// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we want to use dynamic navbar, we need to enable it for this view:
    dynamicNavbar: true
});

var mainView = myApp.addView('.view-main');


// Handle Cordova Device Ready Event
$$(document).on('deviceready', function() {
    console.log("Device is ready!");

});


// Now we need to run the code that will be executed only for About page.

// Option 1. Using page callback for page (for "about" page in this case) (recommended way):
myApp.onPageInit('about', function (page) {
    // Do something here for "about" page

})

// Option 2. Using one 'pageInit' event handler for all pages:
$$(document).on('pageInit', function (e) {
    // Get page data from event data
    var page = e.detail.page;

    if (page.name === 'about') {
        // Following code will be executed for page with data-page attribute equal to "about"
        myApp.alert('Here comes About page');
    }
})

// Option 2. Using live 'pageInit' event handlers for each page
$$(document).on('pageInit', '.page[data-page="login"]', function (e) {

    $$('.login-btn').on('click',function(){
        var id = $$('#linst-id').val();
        var passw = $$('#lpass').val();
        if (id == 'admin' && passw == "admin") {
            myApp.alert("Login Success!!!")
            mainView.router.loadPage('access-control.html');
        }
        else{
            myApp.alert("Invalid credentials!!!")
        }
    })

})


$$(document).on('pageInit', '.page[data-page="register"]', function (e) {

    $$('.signup-btn').on('click', function () {

        myApp.alert("Clicked signup");
    })

})

$$(document).on('pageInit', '.page[data-page="access-control"]', function (e) {

    $$('.enable-btn').on('click', function () {
        var labName = $$('#lab-name').val();
        socket.emit('toggle',{status:'enable',labName: labName});
        // myApp.alert(labName);
    })

    $$('.disable-btn').on('click', function () {
        var labName = $$('#lab-name').val();
        socket.emit('toggle', { status: 'disable', labName: labName });
        // myApp.alert(labName);
    })

    socket.on('reply', function(reply){
        console.log("reply: "+reply)
        if(reply=='enable')
            myApp.alert('Enabled succesfully!!')
        else if (reply == 'disable')
            myApp.alert('Disabled succesfully!!')
        else
            myApp.alert('Unexpected Error!!')

    });


})
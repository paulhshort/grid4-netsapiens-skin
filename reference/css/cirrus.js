// /***** BV JAVASCRIPT *****/ //

/* REDIRECT TO CIRRUS.BLINKCOMET.COM */
 if (!window.location.href.startsWith('https://cirrus.blinkcomet.com/portal/')) {
 window.location.href = 'https://cirrus.blinkcomet.com/portal/';
 }

/* WHEN NEEDED SUPPORT ON CORE 2 REMOVE CSS */
 var currentURL = window.location.href;
 if (currentURL.includes("core2.blinkcomet.com")) {
 var unwantedStylesheet = document.querySelector('link[href="https://core1.blinkcomet.com/css/cirrus.css"]');
 if (unwantedStylesheet) {
 unwantedStylesheet.parentNode.removeChild(unwantedStylesheet);
 }
 }

/* ALL PASSWORDS REQUIRED */
$(document).ready(function(){
$("#ButtonAddUser").click(function(){
setTimeout(function(){
$("#user-add #UserSubscriberPin").addClass("validate[required]");
$("#new-password").addClass("validate[required]");
}, 1000); // 1000 milliseconds = 1 second
});
});

/* HIDE RING GROUP BUTTON */
//$(document).ready(function(){
//$("#LinkRinggroup").addClass("hide");
//});
//$(document).ready(function(){
//$('#LinkRinggroup').remove();
//});

/* ADD CLASS TO BODY */
window.onload = function() {
var currentUrl = window.location.href;
if (currentUrl.endsWith('/')) {
currentUrl = currentUrl.slice(0, -1);
}
var bodyElement = document.body;

if (currentUrl.startsWith('https://core1.blinkcomet.com/portal/domains')) {
bodyElement.classList.add('domains');

} else if (currentUrl.startsWith('https://cirrus.blinkcomet.com/portal/domains')) {
bodyElement.classList.add('domains');

} else if (currentUrl.startsWith('https://core1.blinkcomet.com/portal/inventory/import')) {
bodyElement.classList.add('import');

} else if (currentUrl.startsWith('https://cirrus.blinkcomet.com/portal/inventory/import')) {
bodyElement.classList.add('import');

} else if (currentUrl.startsWith('https://core1.blinkcomet.com/portal/inventory')) {
bodyElement.classList.add('inventory');

} else if (currentUrl.startsWith('https://cirrus.blinkcomet.com/portal/inventory')) {
bodyElement.classList.add('inventory');

} else if (currentUrl.startsWith('https://core1.blinkcomet.com/portal/uiconfigs/index/details')) {
bodyElement.classList.add('uiconfigs','dinformation');

} else if (currentUrl.startsWith('https://cirrus.blinkcomet.com/portal/uiconfigs/index/details')) {
bodyElement.classList.add('uiconfigs','dinformation');

} else if (currentUrl.startsWith('https://core1.blinkcomet.com/portal/uiconfigs')) {
bodyElement.classList.add('uiconfigs');

} else if (currentUrl.startsWith('https://cirrus.blinkcomet.com/portal/uiconfigs')) {
bodyElement.classList.add('uiconfigs');

} else if (currentUrl.startsWith('https://core1.blinkcomet.com/portal/attendants')) {
bodyElement.classList.add('attendants');

} else if (currentUrl.startsWith('https://cirrus.blinkcomet.com/portal/attendants')) {
bodyElement.classList.add('attendants');

} else if (currentUrl.startsWith('https://core1.blinkcomet.com/portal/agents')) {
bodyElement.classList.add('callcenter');

} else if (currentUrl.startsWith('https://cirrus.blinkcomet.com/portal/agents')) {
bodyElement.classList.add('callcenter');

} else if (currentUrl.startsWith('https://core1.blinkcomet.com/portal/timeframes')) {
bodyElement.classList.add('timeframes');

} else if (currentUrl.startsWith('https://cirrus.blinkcomet.com/portal/timeframes')) {
bodyElement.classList.add('timeframes');

} else if (currentUrl.startsWith('https://core1.blinkcomet.com/portal/music')) {
bodyElement.classList.add('music');

} else if (currentUrl.startsWith('https://cirrus.blinkcomet.com/portal/music')) {
bodyElement.classList.add('music');

} else if (currentUrl.startsWith('https://core1.blinkcomet.com/portal/builder')) {
bodyElement.classList.add('builder');

} else if (currentUrl.startsWith('https://cirrus.blinkcomet.com/portal/builder')) {
bodyElement.classList.add('builder');

} else if (currentUrl === ('https://cirrus.blinkcomet.com/portal/stats/queuestats/agent_availability')) {
bodyElement.classList.add('stats','agentavailability');

} else if (currentUrl === ('https://cirrus.blinkcomet.com/portal/stats/queuestats/agent_availability')) {
bodyElement.classList.add('stats','agentavailability');

} else if (currentUrl.startsWith('https://core1.blinkcomet.com/portal/stats')) {
bodyElement.classList.add('stats');

} else if (currentUrl.startsWith('https://cirrus.blinkcomet.com/portal/stats')) {
bodyElement.classList.add('stats');

} else if (currentUrl.startsWith('https://core1.blinkcomet.com/portal/contacts/popout')) {
bodyElement.classList.add('popout');

} else if (currentUrl.startsWith('https://cirrus.blinkcomet.com/portal/contacts/popout')) {
bodyElement.classList.add('popout');

} else if (currentUrl.startsWith('https://core1.blinkcomet.com/portal/contacts')) {
bodyElement.classList.add('contacts');

} else if (currentUrl.startsWith('https://cirrus.blinkcomet.com/portal/contacts')) {
bodyElement.classList.add('contacts');

} else {
var lastPart = currentUrl.substring(currentUrl.lastIndexOf('/') + 1);
var bodyClassName = lastPart.replace(/[^a-zA-Z0-9]/g, ' ');
bodyElement.classList.add(bodyClassName);
}
};

/* ADD CLASS TO PANEL-MAIN */
$(document).ready(function() {
$('[class*="-panel-main"]').each(function() {
var classes = $(this).attr('class').split(' ');
var pagename = '';
for (var i = 0; i < classes.length; i++) {
if (classes[i].endsWith('-panel-main')) {
pagename = classes[i].replace('-panel-main', '');
break;
}
}
$(this).addClass('panel-main');
$(this).addClass(pagename);
});
});


/* ADD CLASS TO CHARTS */
// document.addEventListener("DOMContentLoaded", function () {
// function addClassToCharts() {
// var elements = document.querySelectorAll('text[text-anchor="middle"]');
// elements.forEach(function (element) {
// if (element.getAttribute('text-anchor') === 'middle') {
// element.classList.add('text-middle');
// element.setAttribute('y', '99%');
// }
// });
// }
// // Run the code at 2 seconds
// setTimeout(function () {
// addClassToCharts();
// }, 2000); // 2000 milliseconds = 2 seconds
// // Run the code again at 4 seconds
// setTimeout(function () {
// addClassToCharts();
// }, 4000); // 4000 milliseconds = 4 seconds
// // Run the code again at 6 seconds
// setTimeout(function () {
// addClassToCharts();
// }, 6000); // 6000 milliseconds = 6 seconds
// // Run the code again when the window finishes resizing
// window.addEventListener("resize", function () {
// setTimeout(function () {
// addClassToCharts();
// }, 2000);
// setTimeout(function () {
// addClassToCharts();
// }, 4000);
// setTimeout(function () {
// addClassToCharts();
// }, 6000);
// });
// // Run the code when Refresh button pressed
// var refreshIcon = document.querySelector('.icon-refresh');
// refreshIcon.addEventListener('click', function() {
// setTimeout(function () {
// addClassToCharts();
// }, 2000);
// setTimeout(function () {
// addClassToCharts();
// }, 4000);
// setTimeout(function () {
// addClassToCharts();
// }, 6000);
// });
// });


/* SHOW HIDE USER MENU */
if (window.location.pathname.startsWith('/portal/stats/')) {
document.addEventListener("DOMContentLoaded", function() {
var toggleUserMenu = document.getElementById("toggle-user-menu");
var userToolbar = document.getElementById("header-user");
toggleUserMenu.addEventListener("click", function() {
userToolbar.classList.toggle("show");
document.querySelector('#pageRefresh').click();
});
});
} else {
document.addEventListener("DOMContentLoaded", function() {
var toggleUserMenu = document.getElementById("toggle-user-menu");
var userToolbar = document.getElementById("header-user");
toggleUserMenu.addEventListener("click", function() {
userToolbar.classList.toggle("show");
});
});
}

/* SHOW HIDE BACKGROUND OPTIONS */
document.getElementById('showBKGD').addEventListener('click', function() {
var backgroundSelectionDiv = document.getElementById('background-selection');
backgroundSelectionDiv.classList.toggle('show');
});
document.getElementById('closeBKGD').addEventListener('click', function() {
var backgroundSelectionDiv = document.getElementById('background-selection');
backgroundSelectionDiv.classList.toggle('show');
});

/* JQUERY REMEMBER SELECTED BACKGROUND */
$(document).ready(function() {
// Check for previously selected background class in cookies
var selectedBackground = Cookies.get('selectedBackground');
if (selectedBackground) {
$('.bkgd-options li[data-background="' + selectedBackground + '"]').addClass('selected');
// Update body background based on the selected option
// Set the background image
$('body').css('background-image', 'url("' + selectedBackground + '")');
} else {
// If nothing is selected
var defaultBackground = 'https://core1.blinkcomet.com/css/bkgds/blue.jpg';
// Set the background image to the default
$('body').css('background-image', 'url("' + defaultBackground + '")');

// Save default background in cookies
Cookies.set('selectedBackground', defaultBackground);
}
// Handle click event on options
$('.bkgd-options li').click(function() {
// Remove selected class from all options
$('.bkgd-options li').removeClass('selected');
// Add selected class to the clicked option
$(this).addClass('selected');
// Update body background based on the selected option
var backgroundValue = $(this).data('background');
// Set the background image
$('body').css('background-image', 'url("' + backgroundValue + '")');
// Save selected background in cookies
Cookies.set('selectedBackground', backgroundValue);
});
});




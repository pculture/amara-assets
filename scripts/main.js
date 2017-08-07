require('jquery');
require('venobox');
var test = require('./hello');
test.hello();


$(function() {
  console.log("HELLO jQuery and Modernizr loaded");
});

$(document).ready(function() {
  // Doc Ready
  // check for url parameters
  // if thanks = true then display thank you message
  // in 30 sec fade out
  // var params = window.location.search.substring(1);
  // if (params.indexOf('thanks') > -1 ) {
  //   $('#message').removeClass('hide');
  //   setTimeout(function(){ 
  //     $('#message').fadeOut('slow');
  //   }, 4000);
  // }

  $(window).scroll(function(){
    if ($(window).scrollTop() >= 250) {
      $('#page-header').addClass('consolidate-header');
     }
     else {
      $('#page-header').removeClass('consolidate-header');
     }
  });

  // Attempt at scrolling to top when language menu is open, problem because menu is fixed position
  // $('#lang').on('show.bs.dropdown', function () {
  //   window.console.log('language menu clicked');
  //   $('html, body').animate({
  //       scrollTop: $("#lang").offset().top
  //   }, 2000);
  // })

  //Instantiate venobox
  $('.venobox').venobox(); 
});
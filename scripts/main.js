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
      $('body').addClass('consolidate-header');
     }
     else {
      $('body').removeClass('consolidate-header');
     }
  });

  // Select all links with hashes
  $('a[href*="#"]')
  // Remove links that don't actually link to anything
  .not('[href="#"]')
  .not('[href="#0"]')
  .click(function(event) {
    // On-page links
    if (
      location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') 
      && 
      location.hostname == this.hostname
    ) {
      // Figure out element to scroll to
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      // Does a scroll target exist?
      if (target.length) {
        // Only prevent default if animation is actually gonna happen
        //event.preventDefault();
        $('html, body').animate({
          scrollTop: target.offset().top - 50
        }, 1000, function() {
          // Callback after animation
          // Must change focus!
          var $target = $(target);
          $target.focus();
          if ($target.is(":focus")) { // Checking if the target was focused
            return false;
          } else {
            $target.attr('tabindex','-1'); // Adding tabindex for elements not focusable
            $target.focus(); // Set focus again
          };
        });
      }
    }
  });

  function resolveHash() {
    $('body').addClass('consolidate-header');
  }
  
  //check for hash on page load
  if (window.location.hash) {
    window.console.log('hash exists', window.location.hash);
    resolveHash();
  }

  //Instantiate venobox
  $('.venobox').venobox(); 
});
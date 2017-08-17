require('jquery');
require('venobox');
require('./animations');
var slider = require('./slider');
var message = require('./message');
var consolidateOffset = 250;


$(window).scroll(function(){
  if ($(window).scrollTop() >= consolidateOffset) {
    $('body').addClass('consolidate-header');
   }
   else {
    $('body').removeClass('consolidate-header');
   }
});



$(document).ready(function() {
  // Instantiate venobox
  $('.venobox').venobox();

  // Animate sliders
  slider.animate();

  if(message.check) {
    // Show the message
    message.show();
  } else {
    // Remove message from DOM?
  }

  // Select all links with hashes
  $('a[href*="#"]')
  // Remove links that don't actually link to anything
  .not('[href="#"]')
  .not('[href="#0"]')
  .on('click', function(event) {
    // On-page links
    if (
      location.pathname.replace(/^\//, '') === this.pathname.replace(/^\//, '') &&
      location.hostname === this.hostname
    ) {
      // Figure out element to scroll to
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      // Does a scroll target exist?
      if (target.length) {
        // Only prevent default if animation is actually gonna happen
        event.preventDefault();
        $('html, body').animate({
          scrollTop: target.offset().top - 100
        }, 1000, function() {
          // Callback after animation
          // Must change focus!
          var $target = $(target);
          $target.focus();
          if ($target.is(':focus')) { // Checking if the target was focused
            return false;
          } else {
            $target.attr('tabindex','-1'); // Adding tabindex for elements not focusable
            $target.focus(); // Set focus again
          }
        });
      }
    }
  });


  
  //check for hash on page load
  if (window.location.hash) { 
    resolveHash();
  }

});

function resolveHash() {
  window.console.log("HASH:", window.location.hash.substring(1));

  var hash = '#' + window.location.hash.substring(1);

  if ($(hash).hasClass('tab-pane') === true) {
    window.console.log('has-class');
    $('a[href*="' + hash + '"]').tab('show');
    $('html, body').animate({ scrollTop: $(hash).offset().top - 100}, 1000);
  }
  else {
    $('html, body').animate({ scrollTop: $(hash).offset().top - 50}, 1000);
  }
  
}



window.$ = window.jQuery = require('jquery');
require('venobox');
require('waypoints');
require('inview');
require('select2')(window, $);
require('./animations');
require('../shared/third-party/behaviors');
require('../shared/announcements');
require('../shared/messages');
require('../shared/select/main');
require('../shared/fileUpload');
require('../shared/compoundField');
require('../shared/ajax');
require('../shared/languageSwitcher');
require('../shared/tabs');
require('../shared/dropdown');
require('../shared/listView');
require('../shared/checkAll');
require('../shared/contentHeader');

var state   = require('./state');
var slider = require('./slider');
var message = require('./message');
var testimonials = require('./testimonials');
var consolidateOffset = 250;
var pageOffset = 100;

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

  // Messages
  if(message.check) {
    // Show the message
    message.show();
  } else {
    // Remove message from DOM?
  }

  // Display random testimonials
  $('.testimonials').each(function() {
    var quotes = $(this).find('blockquote');
    testimonials.showRandom(quotes);
  });
  

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
          scrollTop: target.offset().top - pageOffset
        }, 1000, function() {
          // Focus the element after the animation
          $(target).focus();
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
    $('a[href*="' + hash + '"]').tab('show');
    // TODO - This should be modified to be more exact. Currently not in use though
    var section = 
    $('html, body').animate({ scrollTop: $(hash).offset().top - pageOffset + 80 }, 1000);
  }
  else {
    $('html, body').animate({ scrollTop: $(hash).offset().top - pageOffset}, 1000);
  }
  
}



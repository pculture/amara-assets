require('jquery');
require('waypoints');
require('inview');


$('.illustration').each(function() {
  new Waypoint.Inview({
    element: this,
    enter: function(direction) {
      window.console.log('Enter triggered with direction ' + direction);
      $(this.element).find('img').attr('class', 'animated fadeInUp');
    },
    entered: function(direction) {
      window.console.log('Entered triggered with direction ' + direction);
      $(this.element).find('svg').attr('class', 'animated pulse');
    },
    exit: function(direction) {
      window.console.log('Exit triggered with direction ' + direction);
      $(this.element).find('svg').attr('class', 'animated');
      $(this.element).find('img').attr('class', 'animated');
    },
    exited: function(direction) {
      window.console.log('Exited triggered with direction ' + direction);
    }
  });
});
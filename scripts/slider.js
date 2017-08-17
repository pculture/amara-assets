module.exports  = {
  animate: function() {
    var slider = $('.slider-row');
    var images = slider.find('img');
    images.clone().appendTo(slider);
    slider.addClass('animate');
  }
};
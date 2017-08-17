module.exports  = {
  animateSlider: function() {
    var slider = $('.slider-row').first();

    var slider_width = slider.width();

    window.console.log(slider_width);

    var slider_new = slider.clone();

    slider_new.css({'left' : slider_width}).appendTo($('.slider-viewport'));
  }
};
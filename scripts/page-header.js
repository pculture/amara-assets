function consolidateHeader() {
  $(window).scroll(function(){
    if ($(window).scrollTop() >= 250) {
      $('#page-header').addClass('consolidate-header');
     }
     else {
      $('#page-header').removeClass('consolidate-header');
     }
  });
}
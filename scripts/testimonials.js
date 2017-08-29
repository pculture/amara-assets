require('jquery');

module.exports = {
  showRandom: function($array) {
    var size = $array.length;
    var choice = Math.ceil(size * Math.random())/1 - 1;
    
    $array.eq(choice).attr('class','active');
  }
};
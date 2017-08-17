var state   = require('./state');
var hashObj = state.deserializeHash();

window.console.log('HASH OBJECT:', hashObj);

module.exports  = {
  check: function() {
    return false;
    // return hashObj.message ? true : false;
  },
  show: function() {
    $("#" + hashObj.anchor).find('.message').show();
    return;
  }

};


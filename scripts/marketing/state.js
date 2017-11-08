module.exports  = {
  deserializeHash: function() {
      var hash    = window.location.hash.replace(/^#/g, '');
      var obj     = null;
      var groups  = [];

      if (!hash) return obj;

      // Build object from existing hash
      obj = {};
      obj.hash_string = hash;

      groups = hash.split('&');

      groups.forEach(function(group) {
        var pair = group.split('=');

        if(pair.length === 1) {

          obj.anchor = pair[0];
        
        } else {

          var key = pair[0];
          var value = pair[1].split(',');
          if(value.length === 1) {
            obj[key] = value[0];
          } else {
            obj[key] = value;
          }
          

        }

      });
      return obj;
  }
};


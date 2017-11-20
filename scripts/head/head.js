var WebFont = require('webfontloader');

WebFont.load({
  google: {
    families: [
        'Open Sans:300,300i,400,400i,600,600i,700,700i,800,800i',
        'Raleway:100,100i,200,200i,300,300i,400,400i,500,500i,600,600i,700,700i,800,800i,900,900i',
    ]
  },
  loading: function() {
    console.log("LOADING FONTS");
  },
  active: function() {
    console.log("ACTIVE FONTS");
  },
  inactive: function() {},
  fontloading: function(familyName, fvd) {},
  fontactive: function(familyName, fvd) {},
  fontinactive: function(familyName, fvd) {},
  timeout: 2000 // Set the timeout to two seconds/
});

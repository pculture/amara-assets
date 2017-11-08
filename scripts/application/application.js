// require jquery and all plugins first, this way if other modules depend on jquery they will get the plugins too
window.jQuery = window.$ = require('jquery');
require('bootstrap');
require('jquery-behaviors');
require('jquery-form')(window, $);
require('select2')(window, $);
require('jscrollpane');

// require all the other modules
// Third party libraries
require('chartist');
require('chartist-plugin-tooltip');
// Amara modules
require('./ajax');
require('./dialogs');
require('./proxyField');
require('./dependentSelect');
require('./languageSwitcher');
require('./select/main');
require('./scrollBars');
require('./selectList');
require('./videoPage');
require('./videoSubtitles');
require('./fileUpload');
require('./clamp');
require('./staffControls');
require('./styleGuide');

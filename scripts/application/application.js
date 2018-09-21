// require jquery and all plugins first, this way if other modules depend on jquery they will get the plugins too
window.jQuery = window.$ = require('jquery');
require('bootstrap-sass');
require('jquery-form')(window, $);
require('select2')(window, $);
require('../shared/third-party/behaviors');
require('../shared/announcements');
require('../shared/messages');

// require all the other modules
// Third party libraries
require('chartist');
require('chartist-plugin-tooltip');
// Amara modules
require('../shared/ajax');
require('./proxyField');
require('./dependentSelect');
require('../shared/languageSwitcher');
require('../shared/select/main');
require('./selectList');
require('./videoPage');
require('./videoSubtitles');
require('../shared/fileUpload');
require('../shared/imageInput');
require('../shared/compoundField');
require('./clamp');
require('./staffControls');
require('../shared/tabs');
require('../shared/teamRoleSelect');
require('../shared/multipleAutoCompleteSelect');
require('../shared/videoCreatePage');
require('../shared/multiField');
require('../shared/formBacktotop');
require('../shared/formSaveChanges');
require('../shared/dropdown');
require('../shared/filterBox');
require('../shared/listView');
require('../shared/checkAll');
require('../shared/contentHeader');
require('../shared/actionBar');

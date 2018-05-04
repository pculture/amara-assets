var $ = require('jquery');
var cookies = require('browser-cookies');

$.behaviors('.languageSwitcher', function(languageSwitcher) {
    var links = $('.languageSwitcher-item', languageSwitcher);
    var input = $('.languageSwitcher_searchBar', languageSwitcher);

    input.on('keyup', function() {
        var filter = input.val().toLowerCase();
        var li = $('.languageSwitcher_list > li', languageSwitcher);
        for (var i = 0; i < li.length; i++) {
            var a = li[i].firstChild;
            if (a.innerHTML.toLowerCase().indexOf(filter) > -1) {
                li[i].style.display = "";
            } else {
                li[i].style.display = "none";
            }
        }
    });

    links.on('click', function(evt) {
        var languageCode = $(this).data('languageCode');
        cookies.set('language', languageCode, {expires: 5 * 365});
    });
});

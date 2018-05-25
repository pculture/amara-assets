/* Amara, universalsubtitles.org
 *
 * Copyright (C) 2017 Participatory Culture Foundation
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see
 * http://www.gnu.org/licenses/agpl-3.0.html.
 */

var $ = require('jquery');
var cookies = require('browser-cookies');

$.behaviors('.persistentTabs', function(elt) {
    var cookieName = $(elt).data('persistentTabCookie');
    if(!cookieName) {
        return;
    }
    var currentValue = cookies.get(cookieName);
    if(currentValue) {
        var activeTab = $(currentValue);
        if(activeTab) {
            var container = activeTab.closest('.tab-content');
            $('.tab-pane', container).removeClass('active');
            activeTab.addClass('active');
        }

        var activeLI = $('a[href="' + currentValue + '"]').parent('li');
        console.log('activeLI1: ', activeLI);
        if(activeLI) {
            console.log('activating');
            activeLI.siblings('li').removeClass('active')
            activeLI.addClass('active');
            console.log(activeLI[0]);
        }
    }
    $('.persistentTab', elt).click(function(evt) {
        cookies.set(cookieName, $(this).attr('href'));
    });
});


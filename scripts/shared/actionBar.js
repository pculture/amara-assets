/*
 * Amara, universalsubtitles.org
 *
 * Copyright (C) 2018 Participatory Culture Foundation
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

// actionBar -- bar with buttons to perform bulk actions that appears at the
// bottom of the screen
//
// Note that there's also some code in application/selectList.js to handle
// this.  That code is deprecated.  This code works standalone, it's typically
// paired with listView, but could also be used without it.

var $ = require('jquery');

$.behaviors('.actionBar', actionBar);

function actionBar(elt) {
    elt = $(elt);
    var inputName = elt.data('inputName') || 'selection';
    var form = $('.actionBar-form', elt);
    var checkboxes = $('input[name=' + inputName + ']');
    var selection = $('<input>', { 
        type: 'hidden',
        name: inputName
    }).appendTo(form);

    checkboxes.change(updateActionBar);

    function updateActionBar() {
        var selectedItems = getSelection();
        elt.toggleClass('open', selectedItems.length > 0);
        selection.val(selectedItems.join('-'));
    }

    function getSelection() {
        var selection = [];
        checkboxes.filter(":checked").each(function() {
            selection.push(this.value);
        });
        return selection;
    }
}

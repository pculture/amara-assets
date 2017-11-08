/*
 * Amara, universalsubtitles.org
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

$.behaviors('.videoSubtitles-revisions', subtitleRevisions);

function subtitleRevisions(section) {
    var checkboxes = $('input[type=checkbox]', section);
    var compareLink = $('.videoSubtitles-compare', section);

    updateCompareLink();

    checkboxes.change(function() {
        // allow no more than 2 checkboxes to be checked at once
        if(this.checked && checkboxes.filter(':checked').length > 2) {
            this.checked = false;
        }
        updateCompareLink();
    });

    function updateCompareLink() {
        var checked = checkboxes.filter(':checked');
        if(checked.length == 2) {
            var id1 = checked.eq(0).data('id');
            var id2 = checked.eq(1).data('id');
            var url = compareLink.data('urlTemplate').replace(/111\/222\/$/, id1 + '/' + id2 + '/');
            compareLink.attr("href", url).removeClass('disabled');
        } else {
            compareLink.attr("href", "#").addClass('disabled');
        }
    }
}

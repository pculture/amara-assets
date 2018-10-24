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

var $ = require('jquery');

$.behaviors('.team-permissionsTableDynamicRow', permissionsTableDynamicRow);

function permissionsTableDynamicRow(row) {
    row = $(row);
    var settingName = row.data('settingName');
    var spans = $('span.fa', row);
    var checkboxes = $('#team-permissionsForm input[name^=' + settingName + '_]');
    checkboxes.each(function(i) {
        $(this).on('change', i, handleChange);
    });

    function handleChange(evt) {
        var span = spans.eq(evt.data);
        var checked = $(this).prop('checked');
        span.toggleClass('text-lime fa-check', checked);
        span.toggleClass('text-amaranth fa-times', !checked);
    }
}

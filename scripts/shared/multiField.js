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

$.behaviors('.multiField.dependent', multiFieldDependent);

function multiFieldDependent(container) {
    $('input[type=checkbox]:checked', container).each(function() {
        $(this).closest('.multiField-input').addClass('checked');
    });
    $('input[type=checkbox]', container).change(function() {
        var input = $(this).closest('.multiField-input')

        if(this.checked) {
            var prevInputs = input.prevAll('.multiField-input');
            var prevCheckboxes = $('input[type=checkbox]', prevInputs);
            prevCheckboxes.prop('checked', true);
            prevInputs.add(input).addClass('checked');
        } else {
            var nextInputs = input.nextAll('.multiField-input');
            var nextCheckboxes = $('input[type=checkbox]', nextInputs);
            nextCheckboxes.prop('checked', false);
            nextInputs.add(input).removeClass('checked');
        }
    });
}

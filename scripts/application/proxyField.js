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

$.behaviors('.proxyField', proxyField);

function proxyField(container) {
    var container = $(container);
    var realField = $(container.data('proxyFor'));
    $(':input', container).change(updateRealField);
    if(!container.hasClass('deferUpdate')) {
        $('input[type=text], textarea', container).keyup(updateRealField);
    }
    function updateRealField() {
        var newVal = $(this).val();
        if(newVal != realField.val()) {
            realField.val($(this).val());
            realField.trigger('change');
        }
    }
}

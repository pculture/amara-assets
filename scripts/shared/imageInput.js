/*
 * Amara, universalsubtitles.org
 *
 * Copyright (C) 2016 Participatory Culture Foundation
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

$.behaviors('.imageInput', imageInput);

function imageInput(container) {
    var button = $('.imageInput-button', container);
    var buttonContainer = $('.imageInput-buttonContainer', container);
    var buttonContainer = $('.imageInput-buttonContainer', container);
    var fileInput = $('.imageInput-fileInput', container);
    var thumbnail = $('.imageInput-thumbnail', container);
    var text = $('.imageInput-text', container);

    buttonContainer.on('mouseenter', function() {
        button.addClass('hover');
    }).on('mouseleave', function() {
        button.removeClass('hover');
    });

    fileInput.on('change', function(evt) {
        var reader = new FileReader();
        reader.onload = function(){
            thumbnail.prop('src', reader.result);
        };
        text.val(evt.target.files[0].name);
        reader.readAsDataURL(evt.target.files[0]);

    });
}


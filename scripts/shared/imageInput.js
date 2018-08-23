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
    container = $(container);
    var buttonContainer = $('.imageInput-buttonContainer', container);
    var thumbnail = $('.imageInput-thumbnail', container);
    var text = $('.imageInput-text', container);
    var clearInput = $('.imageInput-clear', container);
    var fileInput = $('.imageInput-fileInput', container);
    var button = $('.imageInput-button', container);
    var hiddenArea = $('.imageInput-hiddenArea', container);

    buttonContainer.on('mouseenter', function() {
        $('.imageInput-button', container).addClass('hover');
    }).on('mouseleave', function() {
        $('.imageInput-button', container).removeClass('hover');
    });

    fileInput.on('change', onFileChange);
    if(button.data('action') == 'remove') {
        button.on('click', onRemove);
    }

    function onFileChange(evt) {
        updatePreviewThumbnail(evt);
        text.val(evt.target.files[0].name);
        clearInput.val('');
        button.text(gettext('Remove')).on('click', onRemove);
        fileInput.detach().appendTo(hiddenArea);
    }

    function onRemove(evt) {
        thumbnail.removeAttr('src');
        text.val('');
        clearInput.val('1');
        button.text(gettext('Browse')).off('click');
        fileInput.detach().appendTo(buttonContainer);
        fileInput.val('');
    }

    function updatePreviewThumbnail(evt) {
        var reader = new FileReader();
        reader.onload = function(){
            thumbnail.attr('src', reader.result);
        };
        reader.readAsDataURL(evt.target.files[0]);
    }

}


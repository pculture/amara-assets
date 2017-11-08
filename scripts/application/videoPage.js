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

$.behaviors('table.video_urls button[data-toggle=url-modal]', openUrlModalButton);

function openUrlModalButton(button) {
    button = $(button);
    button.click(function(evt) {
        var row = $(this).closest('tr');
        var dialog = $(button.data('target'));
        dialog.modal('show');
        $('.url', dialog).text(row.data('url'));
        $('input[name=id]', dialog).val(row.data('id'));
    });
}


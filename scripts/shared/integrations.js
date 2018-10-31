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

$.behaviors('.syncHistoryList-action-sync', function(btn) {
    var btn = $(btn);

    btn.on('click', function() {
        var btn = $(this)
        var span = btn.find('span')
        var ajax_url = btn.data('ajax-url')
        var pk = btn.data('sl-pk')

        $.ajax({
            url: ajax_url,
            method: 'GET',
            data: { 'pk': pk },

            beforeSend: function() {
                span.removeClass('fa-cloud-upload-alt')
                span.addClass('fa-spinner fa-spin')
                btn.css('visibility', 'visible')
            },

            complete: function() {
                btn.css('visibility', '')
                span.removeClass('fa-spinner fa-spin')
                span.addClass('fa-cloud-upload-alt')
            },

            success: function() {
                console.log('success')
            },
            error: function() {
                console.log('error')
            }
        })

    });
});

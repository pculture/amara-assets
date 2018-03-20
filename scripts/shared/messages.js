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

$.behaviors('.newMessages', function(elt) {
    var elt = $(elt);
    var lastUnread = elt.attr('data-last-unread'); // use attr() instead of data(), because we want to avoid jQuery converting the value to an int

    $('.newMessages-hide', elt).click(function(evt) {
        elt.hide();
        $.post({
            url: "/auth/set-hidden-message-id/",
            data: { message_id: lastUnread },
            headers: { "X-CSRFToken": cookies.get('csrftoken')}
        })
        evt.preventDefault();
        evt.stopPropagation();
    });
});

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

$.behaviors('.fieldset-backtotop-container', function(container) {
    var form = $(container).closest('form');    

    function auto_scroll() {
        var header = $('#page-header')
        var header_height = 0;

        if (header.length) {
            header_height = header.height()
        }        

        $('html, body').animate({
            scrollTop: form.offset().top - header_height
        }, 500);
    }
    $(container).click(auto_scroll);
});
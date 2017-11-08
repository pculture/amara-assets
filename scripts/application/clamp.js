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
var contentUpdate = require('./contentUpdate');

$.behaviors('.clamp', clamp);

function clamp(container) {
    container = $(container);

    $(window).resize(checkOverflow);
    contentUpdate.add(checkOverflow);
    checkOverflow();

    $('.clamp-expand', container).click(function() {
        container.addClass('expanded');
    });
    $('.clamp-collapse', container).click(function() {
        container.removeClass('expanded');
    });

    function checkOverflow() {
        if(container.hasClass('expanded')) {
            return;
        }
        var overflowing = false;
        $('.clamp-lines', container).each(function() {
            if (this.clientHeight < this.scrollHeight) {
                overflowing = true;
            }
        });
        if($('.clamp-list li:hidden', container).length > 0) {
            overflowing = true;
        }
        if(overflowing) {
            container.addClass('overflowing');
        } else {
            container.removeClass('overflowing');
        }
    }
}

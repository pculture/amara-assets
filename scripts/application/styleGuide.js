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
var contentUpdate = require('./contentUpdate');

$.behaviors('.styleGuide', styleGuide);

function styleGuide(container) {
    $('.styleGuide-navLink', container).click(function(evt) {
        var link = $(this);
        var anchor = link.attr('href');
        // Remove old active classes
        $('.styleGuide-navLink.active, .styleGuide-section.active', container).removeClass('active');
        // Add new active classes
        link.addClass('active');
        $(anchor).addClass('active').updateBehaviors();

        contentUpdate.fire();

        evt.preventDefault();
        window.location.hash = anchor;
        setTimeout(function() { window.scrollTo(0, 0) }, 1);
    });

    // check for hash
    var hash = window.location.hash;
    if(hash) {
        $('[href="'+hash+'"]').click();
    } else {
        $('.styleGuide-navLink', container).filter(':first').click();
    }


    $('.actionBar-open').on('click', function(){
      $('#styleGuide-actionBar').toggleClass('open');
    });
}

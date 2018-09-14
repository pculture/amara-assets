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

// position -- position elements in various ways

$ = require('jquery');

function eltTop(elt) {
    return elt.offset().top;
}

function eltBottom(elt) {
    return elt.offset().top + elt.outerHeight();
}

function viewportTop() {
    return $(window).scrollTop();
}

function viewportBottom() {
    return $(window).scrollTop() + $(window).height();
}

// position an element below another element.
//
// If the element being positioned would be offscreen, then position it on top instead.
function below(elt, reference) {
    elt.detach().appendTo($('body'));
    elt.css({
        'position': 'absolute',
        'top': eltBottom(reference) + 'px',
        'left': reference.offset().left + 'px'
    });

    if(eltBottom(elt) >= viewportBottom() && eltTop(elt) > viewportTop()) {
        elt.css({
            'top': (reference.offset().top - elt.outerHeight()) + 'px'
        });
    }
}

module.exports = {
    below: below
};

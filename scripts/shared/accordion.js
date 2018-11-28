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

var $ = require('jquery');

$.fn.accordion = function(action) {
    if(action === undefined) {
        return this.each(setupAccordion);
    } else {
        var extraArgs = Array.prototype.slice.call(arguments, 1);
        return this.each(function() {
            var accordion = $(this).data('accordion');
            var method = accordion[action];
            if(method) {
                method.apply(accordion, extraArgs);
            } else {
                throw "Unknown accordion action: " + action;
            }
        });
    }
}

$.behaviors('.accordion', setupAccordion);

function setupAccordion(accordion) {
    var accordion = $(accordion);
    if(!accordion.data('accordion')) {
        accordion.data('accordion', new Accordion(accordion));
    }
}

function Accordion(elt) {
    this.elt = elt;
    this.elt.on('click', this.onClick.bind(this));
}

Accordion.prototype = {
    onClick: function(evt) {
        var title = $(evt.target).closest('.accordion-title', this.elt);
        if(title.length) {
            this.toggleSection(title.closest('.accordion-section'));
        }
    },
    expandSection(section) {
        var self = this;
        section = $(section);
        $('.accordion-section.expanded', this.elt).each(function() { self.collapseSection(this); })
        $('.accordion-content', section).slideDown();
        section.addClass('expanded');
    },
    toggleSection(section) {
        section = $(section);
        if(section.hasClass('expanded')) {
            this.collapseSection(section);
        } else {
            this.expandSection(section);
        }
    },
    collapseSection(section) {
        section = $(section);
        // Note, need to set display: block before calling slideUp().
        // Otherwise sliding up elements that were initially shown doesn't work
        // right
        $('.accordion-content', section).css('display', 'block').slideUp();
        section.removeClass('expanded');
    },
    addSection(header, content) {
        var section = $('<div class="accordion-section">');
        section.append(
                $('<h3 class="accordion-title">')
                .text(header)
                .append('<span class="accordion-caret">'));
        section.append($('<div class="accordion-content">').append(content));

        this.elt.append(section);
        this.expandSection(section);
    }
};

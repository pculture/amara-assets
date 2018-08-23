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
var keyCodes = require('./keyCodes');

$.behaviors('.dropdownMenu', dropdownMenu);

function dropdownMenu(menu) {
    menu = $(menu);
    var button = $('#' + menu.attr('aria-labeledby'));
    var links = $('.dropdownMenu-link', menu).not('.disabled');

    button.click(function(evt) {
        if(menuVisible()) {
            hideMenu();
        } else {
            showMenu()
        }
        evt.preventDefault();
    }).keydown(function(evt) {
        if(evt.which == keyCodes.enter ||
                evt.which == keyCodes.space ||
                evt.which == keyCodes.down) {
            showMenu();
            focusFirstLink();
        } else if(evt.which == keyCodes.up) {
            showMenu();
            focusLastLink();
        } else if(evt.which == keyCodes.esc) {
            hideMenu();
        }
        evt.preventDefault();
    });

    links.on('keydown', function(evt) {
        var link = $(this);

        if(evt.which == keyCodes.up) {
            focusPrevLink(link);
        } else if (evt.which == keyCodes.down) {
            focusNextLink(link);
        } else if(evt.which == keyCodes.enter) {
            return activateLink(evt, link);
        } else if(evt.which == keyCodes.esc) {
            hideMenu();
            button.focus();
        } else if(evt.which == keyCodes.home) {
            focusFirstLink();
        } else if(evt.which == keyCodes.end) {
            focusLastLink();
        } else if(evt.which >= 65 && evt.which <= 90) {
            focusNextLinkWithChar(link, String.fromCharCode(evt.which));
        }

        evt.preventDefault();
    }).on('click', function(evt) {
        return activateLink(evt, $(this));
    });

    function activateLink(evt, link) {
        hideMenu();
        if(link.data('activateArgs')) {
            // dropdown-js-item -- trigger link-activate
            button.focus();
            menu.trigger('link-activate', link.data('activateArgs'));
            evt.preventDefault();
        } else {
            // Regular link item.  return now, skipping preventDefault() to
            // make the link click go through.  Also, skip calling
            // button.focus(), since that would stop the click.
            return;
        }
    }

    function menuVisible() {
        return menu.css('display') != 'none';
    }

    function showMenu() {
        if(menuVisible()) {
            return;
        }
        menu.detach().appendTo($('body'));
        button.attr('aria-expanded', 'true');
        menu.css({
            'display': 'flex',
            'top': eltBottom(button) + 'px',
            'left': button.offset().left + 'px'
        });

        if(eltBottom(menu) >= viewportBottom()) {
            menu.css({
                'top': (button.offset().top - menu.outerHeight()) + 'px'
            });
        }
    }

    function hideMenu() {
        button.attr('aria-expanded', 'false');
        menu.css('display', 'none');
    }

    function eltBottom(elt) {
        return elt.offset().top + elt.outerHeight();
    }

    function viewportBottom() {
        return $(window).scrollTop() + $(window).height();
    }

    function focusNextLink(link) {
        var index = (links.index(link) + 1) % links.length;
        links.get(index).focus();
    }

    function focusPrevLink(link) {
        var index = links.index(link) - 1;
        links.get(index).focus();
    }

    function focusFirstLink() {
        links.get(0).focus();
    }

    function focusLastLink() {
        links.get(-1).focus();
    }

    function focusNextLinkWithChar(link, character) {
        var startingIndex = i = links.index(link);
        while(true) {
            i = (i + 1) % links.length;
            if(i == startingIndex) {
                return;
            }
            var currentLink = links.eq(i);
            if(currentLink.text().trim()[0].toUpperCase() == character) {
                currentLink.focus();
                return;
            }
        }
    }
}

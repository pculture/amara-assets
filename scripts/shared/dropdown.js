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
var position = require('./position');

$.behaviors('.dropdownMenu', dropdownMenu);

function dropdownMenu(menu) {
    menu = $(menu);
    var button = $('#' + menu.attr('aria-labeledby'));
    var links = $('.dropdownMenu-link', menu).not('.disabled');
    button.data('menu', menu);

    button.click(function(evt) {
        if(menuVisible()) {
            hideMenu();
        } else {
            showMenu();
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
        } else if(menuVisible() && keyCodeIsAlphaNumeric(evt)) {
            focusNextLinkWithChar(links.eq(-1), String.fromCharCode(evt.which));
        }
        evt.stopPropagation();
        evt.preventDefault();
    }).on('key-activate', function(evt) {
        showMenu();
        focusFirstLink();
    });

    menu.on('hide', function(evt) {
        hideMenu();
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
            focusButton();
        } else if(evt.which == keyCodes.home) {
            focusFirstLink();
        } else if(evt.which == keyCodes.end) {
            focusLastLink();
        } else if(keyCodeIsAlphaNumeric(evt)) {
            focusNextLinkWithChar(link, String.fromCharCode(evt.which));
        }

        evt.stopPropagation();
        evt.preventDefault();
    }).on('click', function(evt) {
        return activateLink(evt, $(this));
    });

    function activateLink(evt, link) {
        hideMenu();
        if(link.data('activateArgs')) {
            // dropdown-js-item -- trigger link-activate
            focusButton();
            menu.trigger('link-activate', link.data('activateArgs'));
            evt.preventDefault();
        } else {
            // Regular link item.  return now, skipping preventDefault() to
            // make the link click go through.  Also, skip calling
            // focusButton, since that would stop the click.
            return;
        }
    }

    function keyCodeIsAlphaNumeric(evt) {
        return evt.which >= 65 && evt.which <= 90;
    }

    function menuVisible() {
        return menu.css('display') != 'none';
    }

    function showMenu() {
        if(menuVisible()) {
            return;
        }
        $('.dropdownMenu:visible').not(menu).trigger('hide');
        position.below(menu, button);
        menu.css('display', 'flex');
        button.attr('aria-expanded', 'true');
    }

    function hideMenu() {
        if(!menuVisible()) {
            return;
        }
        button.attr('aria-expanded', 'false');
        menu.css('display', 'none');
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

    function focusButton() {
        var rv = menu.triggerHandler('focus-button');
        if(rv !== false) {
            button.focus();
        }
    }
}

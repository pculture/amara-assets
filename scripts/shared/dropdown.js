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
var filters = require('./filters');
var querystring = require('./querystring');
var keyCodes = require('./keyCodes');
var position = require('./position');
var copyText = require('./copyText');

// Create a jquery plugin to handle dropdown stuff.  API:
//
//   - $(elt).dropdown(): initialize dropdown code (not needed if you add the .dropdownMenu class)
//   - $(elt).dropdown('show', context): show the dropdown
//   - $(elt).dropdown('hide', context): hide the dropdown
//   - $(elt).dropdown('toggle', context): toggle the dropdown
//   - $(elt).dropdown('focusFirstLink'): focus the first link
//   - $(elt).dropdown('focusLastLink'): focus the last link
//
//   In general, you can call any method of the DropDownMenu class.  The "context" param is a dict with these keys:
//     - button -- button element that caused the dropdown to show/hide (if applicable)
//     - event -- current jQuery event
// 
$.fn.dropdown = function(action) {
    if(action === undefined) {
        return this.each(setupDropdownMenu);
    } else {
        var extraArgs = Array.prototype.slice.call(arguments, 1);
        return this.each(function() {
            var dropdown = $(this).data('dropdown');
            var method = dropdown[action];
            if(method) {
                method.apply(dropdown, extraArgs);
            } else {
                throw "Unknown dropdown action: " + action;
            }
        });
    }
}

$.behaviors('.dropdownMenu', setupDropdownMenu);
$.behaviors('.dropdownMenu-button', dropdownMenuButton);

function dropdownMenuButton(button) {
    var button = $(button);
    var menu = $();

    if(button.data('target')) {
        menu = $('#' + button.data('target'));
        button.data('menu', menu);
    }

    function is_disabled() {
        return button.hasClass('disabled');
    }

    button.click(function(evt) {
        if (is_disabled()) {
            return;
        }
        menu.dropdown('toggle', {button: button, event: evt});
        evt.preventDefault();
    }).keydown(function(evt) {
        if (is_disabled()) {
            return;
        }
        if(evt.which == keyCodes.enter ||
                evt.which == keyCodes.space ||
                evt.which == keyCodes.down) {
            menu.dropdown('show', {button: button, event: evt});
            menu.dropdown('focusFirstLink');
        } else if(evt.which == keyCodes.up) {
            menu.dropdown('show', {button: button, event: evt});
            menu.dropdown('focusLastLink');
        } else if(evt.which == keyCodes.esc) {
            menu.dropdown('hide', {button: button, event: evt});
        }
        evt.stopPropagation();
        evt.preventDefault();
    }).on('key-activate', function(evt) {
        if (is_disabled()) {
            return;
        }
        menu.dropdown('show', {button: button, event: evt});
        menu.dropdown('focusFirstLink');
    });
}

function setupDropdownMenu(menu) {
    menu = $(menu);
    if(!menu.data('dropdown')) {
        menu.data('dropdown', new DropDownMenu(menu));
    }
}

function DropDownMenu(menu) {
    this.menu = menu;
    this.links = $('.dropdownMenu-link', menu).not('.disabled'),
    this.shown = false;
    this.openerButton = null;
    this.showData = null;

    // additional options for position.below
    this.below_options = {}
    this.below_options.dropLeft = menu.hasClass('dropdownMenuLeft')

    this.setupEventHandlers();
    this.updateFilterChecks();
}

DropDownMenu.prototype = {
    show: function(context) {
        if(context === undefined) {
            context = {};
        }
        // The 'show' event gets sent early, so handlers have an opportunity to prevent the action
        var showEventData = {
            dropdownMenu: this,
            showData: context.data,
            button: context.button,
            event: context.event
        };
        if(this.menu.triggerHandler('show', showEventData) === false) {
            return;
        }

        if(this.shown) {
            if(context.button && context.button == this.openerButton) {
                return;
            } else {
                this.hide(context);
            }
        }
        // hide all other menus;
        $('.dropdownMenu:visible').not(this.menu).dropdown('hide', context);
        if(context.button) {
            position.below(this.menu, context.button, this.below_options);
        } else {
            position.below(this.menu, context.event, this.below_options);
        }
        this.menu.css('display', 'flex');
        if(context.button) {
            context.button.attr('aria-expanded', 'true');
        }
        this.openerButton = context.button;
        this.showData = context.data;
        this.shown = true;
        this.setupClickHandler();
        if(context.event) {
            context.event.preventDefault();
            context.event.stopPropagation();
        }
        // The 'shown' event gets sent late, so handlers know the action has succeeded
        this.menu.triggerHandler('shown', showEventData);
    },
    hide: function(context) {
        if(context === undefined) {
            context = {};
        }
        if(!this.shown) {
            return;
        }
        // The 'hide' event gets sent early, so handlers have an opportunity to prevent the action
        var hideEventData = { dropdownMenu: this, showData: this.showData, openerButton: this.openerButton };
        if(this.menu.triggerHandler('hide', { dropdownMenu: this, openerButton: this.openerButton }) === false) {
            return;
        }

        this.menu.css('display', 'none');
        if(this.openerButton) {
            this.openerButton.attr('aria-expanded', 'false');
            this.openerButton = null;
        }
        this.shown = false;
        this.showData = null;
        this.removeClickHandler();
        if(context.event && !context.skipPreventDefault) {
            context.event.preventDefault();
            context.event.stopPropagation();
        }
        // The 'hidden' event gets sent late, so handlers know the action has succeeded
        this.menu.triggerHandler('hidden', hideEventData);
    },
    toggle: function(context) {
        if(this.shown && this.openerButton === context.button) {
            this.hide(context);
        } else {
            this.show(context);
        }
    },
    focusedLinkIndex: function() {
        var link = this.links.filter(':focus');
        if(link.length > 0) {
            return this.links.index(link);
        } else {
            return -1;
        }
    },
    focusFirstLink: function() {
        this.links.get(0).focus();
    },
    focusLastLink: function() {
        this.links.get(-1).focus();
    },
    focusNextLink: function() {
        var index = (this.focusedLinkIndex() + 1) % this.links.length;
        this.links.get(index).focus();
    },
    focusPrevLink: function() {
        var index = this.focusedLinkIndex() - 1;
        this.links.get(index).focus();
    },
    focusNextLinkWithChar: function(character) {
        var startingIndex = i = this.focusedLinkIndex();
        while(true) {
            i = (i + 1) % this.links.length;
            if(i == startingIndex) {
                return;
            }
            var currentLink = this.links.eq(i);
            if(currentLink.text().trim()[0].toUpperCase() == character) {
                currentLink.focus();
                return;
            }
        }
    },
    setupEventHandlers: function() {
        var self = this;

        this.links.on('keydown', function(evt) {
            if(evt.which == keyCodes.up) {
                self.focusPrevLink();
            } else if (evt.which == keyCodes.down) {
                self.focusNextLink();
            } else if(evt.which == keyCodes.enter) {
                self.activateLink(evt, $(this));
            } else if(evt.which == keyCodes.esc) {
                var button = self.openerButton;
                self.hide();
                self.focusButton(button);
            } else if(evt.which == keyCodes.home) {
                self.focusFirstLink();
            } else if(evt.which == keyCodes.end) {
                self.focusLastLink();
            } else if(keyCodes.isAlpha(evt.which)) {
                self.focusNextLinkWithChar(String.fromCharCode(evt.which));
            }

            evt.stopPropagation();
            evt.preventDefault();
        }).on('click', function(evt) {
            self.activateLink(evt, $(this));
        });
    },
    activateLink: function(evt, link) {
        var button = this.openerButton;
        var activateArgs = link.data('activateArgs');
        if(activateArgs) {
            var showData = this.showData;
            // dropdown-js-item -- trigger link-activate
            this.hide({button: button, event: evt });
            if(button) {
                this.focusButton(button);
            }
            this.linkActivateDefault(activateArgs, button);
            this.menu.trigger($.Event('link-activate', {
                openerButton: button,
                showData: showData,
                dropdownMenu: this
            }), activateArgs);
            evt.preventDefault();
        } else {
            this.hide({button: button, event: evt, skipPreventDefault:true });
            // Regular link item.  Don't call preventDefault() to make the link
            // click go through.  Also, skip calling focusButton, since that would
            // stop the click.
        }
    },
    linkActivateDefault: function(args, openerButton) {
        // Handle default link-activate actions.
        if(args[0] == 'copy-text') {
            copyText(openerButton.data(args[1]));
        } else if(args[0] == 'update-filter') {
            var name = args[1];
            var value = args[2];
            filters.add(name, value);
            this.updateFilterChecks();
        }

    },
    updateFilterChecks: function() {
        var qs = querystring.parseList();
        this.links.each(function() {
            var link = $(this);
            var activateArgs = link.data('activateArgs');
            if(activateArgs && activateArgs[0] == 'update-filter') {
                var name = activateArgs[1];
                var value = activateArgs[2];
                var isDefault = (activateArgs.length >= 4 && activateArgs[3] == 'default');
                $('.dropdownMenu-icon', link).remove();
                if((qs[name] && qs[name].indexOf(value) > -1) ||
                        (qs[name] === undefined && isDefault)) {
                    link.prepend($('<span class="fa fa-check dropdownMenu-icon">'));
                }
            }
        });
    },
    focusButton: function(button) {
        var rv = this.menu.triggerHandler('focus-button');
        if(rv !== false) {
            button.focus();
        }
    },
    setupClickHandler: function() {
        this.clickHandler = this.onClickWithOpenDropdown.bind(this);
        document.addEventListener('click', this.clickHandler, true);
    },
    removeClickHandler: function() {
        document.removeEventListener('click', this.clickHandler, true);
        this.clickHandler = null;
    },
    onClickWithOpenDropdown: function(evt) {
        var target = $(evt.target);
        if(target.closest(this.menu).length == 0 &&
                target.closest(this.openerButton).length == 0) {
            this.hide({event:evt, skipPreventDefault: true});
        }
    }
};

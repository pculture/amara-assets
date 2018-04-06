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

/*
 * selectList is used to handle a list of items connected to some popup forms.  When one or more items are selected, we pop open an actionBar. 
 * When one of the buttons on the actionBar is clicked, then we pop up a modal dialog.
 */

var $ = require('jquery');

$.behaviors('.selectList', selectList);
$.behaviors('.selectAll', selectAll);
$.behaviors('.deselectAll', deselectAll);

function selectAll(checkbox) {
    checkbox = $(checkbox);
    var target = checkbox.data('target');
    var inputs = $(target).find('.selectList-checkbox');

    checkbox.change(function() {
        checkbox.prop('checked') ?  inputs.prop('checked', true) : inputs.prop('checked', false);
        inputs.trigger('change');
    });
    inputs.change(function() {
        var allChecked = inputs.filter(':checked').length == inputs.length;
        checkbox.prop('checked', allChecked);
    });
}

function deselectAll(button) {
    button = $(button);
    var target = button.data('target');
    var inputs = $(target).find('.selectList-checkbox').add('[data-target="'+target+'"]');

    button.click(function() {
        inputs.prop('checked', false);
        inputs.trigger('change');
        return false;
    });
}

function selectList(list) {
    list = $(list);
    var actionBar = $(list.data('target'));
    var selection = $('.selectList-selection', actionBar);
    var checkboxes = list.find('.selectList-checkbox');
    var checkboxesFromOtherLists = $('.selectList-checkbox').not(checkboxes);

    // Refactor this: Adding this to change other checkboxes when a user clicks an action on a single item
    var items = list.children();
    items.each(function() {
        var item = $(this);
        var checkbox = item.find('.selectList-checkbox');
        var actions = item.find('.actions');
        actions.on('click', function() {
            checkbox.prop('checked', true);
            checkboxes.not(checkbox).prop('checked', false).trigger("change");
        });
    });
    items.on('click', function() {
        var item = $(this);
        var checkbox = item.find('.selectList-checkbox');
        checkbox.prop('checked', !checkbox.prop('checked'));
    });

    checkboxes.each(function() {
        $(this).on('change', function() {
            updateActionBar();
        });
    });

    function getSelection() {
        var selection = [];
        checkboxes.filter(":checked").each(function() {
            selection.push(this.value);
        });
        return selection;
    }

    function updateActionBar() {
        var selectedItems = getSelection();
        if(selectedItems.length) {
            actionBar.addClass('open');
            checkboxesFromOtherLists.prop('disabled', true);
            // Need to set the title on the parent, since mouse events
            // don't fire for disabled inputs.
            checkboxesFromOtherLists.parent().attr('title', gettext('You can only select from one list at once'));

        } else {
            actionBar.removeClass('open');
            checkboxesFromOtherLists.prop('disabled', null);
            checkboxesFromOtherLists.parent().attr('title', null);
        }
        selection.val(selectedItems.join('-'));
    }
}

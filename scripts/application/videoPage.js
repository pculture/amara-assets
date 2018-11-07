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
var dialogs = require('../shared/dialogs');

$.behaviors('#videourl-dropdown', videourlDropdown);

function videourlDropdown(menu) {
    menu = $(menu);
    var listview = $('.listView.videoUrls');
    var openerButton = null;

    menu.on('show', function(evt, data) {
        var makePrimaryButton = $('.videourl-make-primary .dropdownMenu-link', data.dropdownMenu.menu);
        var deleteButton = $('.videourl-delete .dropdownMenu-link', data.dropdownMenu.menu);

        if(data.button) {
            openerButton = data.button;
        } else if(data.showData && data.showData.row !== undefined) {
            openerButton = $('.dropdownMenu-button', listview).eq(data.showData.row);
        } else {
            console.log("videourlDropdown: can't calculate button");
            return false;
        }
        if(openerButton.data('primary')) {
            makePrimaryButton.addClass('disabled').prop('disabled', true);
            deleteButton.addClass('disabled').prop('disabled', true);
        } else if(openerButton.data('original')) {
            makePrimaryButton.removeClass('disabled').prop('disabled', false);
            deleteButton.addClass('disabled').prop('disabled', true);
        } else {
            makePrimaryButton.removeClass('disabled').prop('disabled', false);
            deleteButton.removeClass('disabled').prop('disabled', false);
        }
    });

    // Map link actions to the dialogs they open
    var dialogMap = {
        "make-primary": "make-url-primary-dialog",
        "delete": "delete-url-dialog"
    };
    menu.on('link-activate', function(evt, action) {
        var dialog = $('#' + dialogMap[action]);
        dialogs.showModal(dialog);
        $('input[name=id]', dialog).val(openerButton.data('videourl'));
        $('.modal-header', dialog).text(openerButton.data('url'));
    });
}

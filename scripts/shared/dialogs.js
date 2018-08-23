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

//
// dialogs.js -- Dialog code
//

var $ = require('jquery');
var _ = require('underscore');

var currentModal = null;
var progressBarTemplate = _.template('<div class="progressBar teal"><div class="progressBar-progress" role="progressbar" style="width: <%- percent %>;"><span class="sr-only"><%- percentLabel %></span></div></div><p class="progressBar-label teal"><%- label %></p>');
function makeProgressBar(progress, label) {
    var percent = (progress * 100) + '%';
    return $(progressBarTemplate({
        percent: percent,
        percentLabel: interpolate(gettext('%(percent)s complete'), {percent: percent}),
        label: label
    }));
}

module.exports = {
    // show/replace the our modal dialog
    showModal: function(content) {
        content = $(content);
        if(currentModal) {
            currentModal.empty().append(content);
        } else {
            currentModal = $('<div class="modal fade" role="dialog"></div>').append(content);
            currentModal.append(content);
            $(document.body).append(currentModal);
            currentModal.modal().on('hidden.bs.modal', function() {
                currentModal.remove();
                currentModal = null;
            });
        }
        return currentModal;
    },
    closeCurrentModal: function() {
        if(currentModal) {
            currentModal.modal('hide');
        }
    },
    // Show a progress bar on the current modal dialog
    showModalProgress: function(progress, label) {
        if(!currentModal) {
            console.log("showModalProgress(), no current modal");
            return;
        }
        var footer = $('.modal-footer', currentModal);
        footer.empty().append(makeProgressBar(progress, label));
    }
};

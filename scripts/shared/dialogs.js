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

$.behaviors('.modal-show', showModalButton);
$.behaviors('.modal-close', hideModalButton);

function showModalButton(elt) {
    var elt = $(elt);
    var modal = $(elt.data('target'));
    elt.click(function(evt) {
        showModal(modal);
        evt.stopPropagation();
        evt.preventDefault();
    });
}

function showModal(modal) {
    var body = $('body');
    modal = $(modal);

    if(currentModal) {
        console.log(modal);
        currentModal.replaceWith(modal);
        modal.show();
    } else {
        $('<div class="modal-backdrop">').appendTo(body).fadeIn(400, function() {
            modal.detach().appendTo(body).show();
        });
        $('body').css('overflow', 'hidden');
    }

    if($('.modal-close', modal).length == 0) {
        setupImplicitClose(modal);
    }

    currentModal = modal;
    return modal;
}

function setupImplicitClose(modal) {
    // Add a close button
    var closeButton = $('<button class="modal-closeButton"><span class="icon icon-close"></span></button>');
    closeButton.appendTo(modal).on('click', onCloseClick);

    // Clicks outside it will close the modal
    $(document).on('click.modal', function(evt) {
        if($(evt.target).closest(modal).length == 0) {
            onCloseClick(evt);
        }
    });
}

function hideModalButton(elt) {
    $(elt).click(onCloseClick);
}

function onCloseClick(evt) {
    closeCurrentModal();
    evt.stopPropagation();
    evt.preventDefault();
}

function closeCurrentModal() {
    if(currentModal) {
        if(currentModal.hasClass('removeOnClose')) {
            currentModal.remove();
        } else {
            currentModal.hide();
        }
        currentModal = null;
        $('.modal-backdrop').remove();
        $(document).off('click.modal');
        $('body').css('overflow', 'auto');
    }
}


module.exports = {
    // show/replace the our modal dialog
    showModal: showModal,
    closeCurrentModal: closeCurrentModal,
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

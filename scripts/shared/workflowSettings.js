/* Amara, universalsubtitles.org
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

$.behaviors('#workflowSettingsForm', function(form) {
    var container = $(form)
    var enable_review_cb = container.find('#id_enable_review')
    var enable_approve_cb = container.find('#id_enable_approve')

    var review_time_input = container.find('#id_assignment_deadline_reviewing')
    var review_time_container = review_time_input.parent()
    var review_time_label = container.find('label[for="id_assignment_deadline_reviewing"]')

    var approve_time_input = container.find('#id_assignment_deadline_approving')
    var approve_time_container = approve_time_input.parent()
    var approve_time_label = container.find('label[for="id_assignment_deadline_approving"]')

    var autocreate_cb = container.find('#id_autocreate_transcriptions')
    var autocreate_settings_container = container.find('.autocreateSettingsContainer')

    /* 
     *  function definitions
     */
    function show_review_time_field() {
        review_time_label.show()
        review_time_container.show()
    }

    function show_approve_time_field() {
        approve_time_label.show()
        approve_time_container.show()
    }


    function hide_review_time_field() {
        review_time_label.hide()
        review_time_container.hide()
    }

    function hide_approve_time_field() {
        approve_time_label.hide()
        approve_time_container.hide()
    }

    function calc_time_fields() {
        if (enable_review_cb.is(':checked')) {
            show_review_time_field()
        }

        if (enable_approve_cb.is(':checked')) {
            show_approve_time_field()
        }    
    }

    function calc_autocreate_settings() {
        if (autocreate_cb.is(':checked')) {
            autocreate_settings_container.show()
        }
    }

    /* 
     *  function calls
     */
    calc_time_fields();
    calc_autocreate_settings();    

    /* 
     *  event handlers 
     */
    enable_review_cb.change(function() {
        if ($(this).is(':checked')) {
            show_review_time_field();
        } else {
            hide_review_time_field();
        }
    });

    enable_approve_cb.change(function() {
        if ($(this).is(':checked')) {
            show_approve_time_field();
        } else {
            hide_approve_time_field();
        }
    });

    autocreate_cb.change(function () {
        if ($(this).is(':checked')) {
            autocreate_settings_container.show()
        } else {
            autocreate_settings_container.hide()
        }
    });
});

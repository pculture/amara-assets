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
    var wfd_container = container.find('.workflowDiagramContainer')

    /*** workflow steps checkboxes ***/
    var enable_review_cb = container.find('#id_enable_review')
    var enable_approve_cb = container.find('#id_enable_approve')

    /*** workflow diagram elements ***/
    var wfd_transcribe = container.find('#wfd_transcribe')
    var wfd_review = container.find('#wfd_review')
    var wfd_review_separator = wfd_review.next()
    var wfd_approve = container.find('#wfd_approve')
    var wfd_approve_separator = wfd_approve.next()
    var wfd_uncertainty = false

    /*** assignment deadlines multi-field elements ***/
    var subtitle_time_input = container.find('#id_assignment_deadline_subtitling')
    var review_time_input = container.find('#id_assignment_deadline_reviewing')
    var review_time_container = review_time_input.parent()
    var review_time_label = container.find('label[for="id_assignment_deadline_reviewing"]')    
    var approve_time_input = container.find('#id_assignment_deadline_approving')
    var approve_time_container = approve_time_input.parent()
    var approve_time_label = container.find('label[for="id_assignment_deadline_approving"]')
    var total_duration_span = container.find('.assignmentDeadlineTotal')
    
    /*** autocreate settings elements ***/
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

    function show_review_wfd() {
        wfd_review.show()
        wfd_review_separator.show()
    }

    function show_approve_wfd() {
        wfd_approve.show()
        wfd_approve_separator.show()
    }

    function hide_review_wfd() {
        wfd_review.hide()
        wfd_review_separator.hide()
    }

    function hide_approve_wfd() {
        wfd_approve.hide()
        wfd_approve_separator.hide()
    }

    function calc_total_duration(workflow_segments) {
        var total_duration = 0
        wfd_uncertainty = false
        $.each(workflow_segments, function(i, segment) {
            duration = $(segment).data('duration')

            if (isNaN(duration)) {
                wfd_uncertainty = true
            } else {
                total_duration += duration    
            }
        })
        return total_duration
    }

    // calculate and adjust the workflow diagram spacing
    function calc_wfd_spacing(container) {
        var container_width = container.width()
        var workflow_segments = container.find('.workflowStep')
        var workflow_segment_last = container.find('.last')

        /* the last segment will always be 150px */
        var last_width = 150    
        // total available space for the segments to occupy
        var segments_space = Math.floor(container_width - last_width)

        var spaces = []
        var total_duration = calc_total_duration(workflow_segments)

        $.each(workflow_segments, function(i, segment) {
            var duration = $(segment).data('duration')
            spaces.push(Math.floor(segments_space * (duration / total_duration)))
        })

        $.each(workflow_segments, function(i, segment) {
            var s = $(segment)
            s.outerWidth(spaces[i])

            var duration = s.data('duration')
            var duration_text = ''
            if (duration > 0) {
                var duration_text_unit = duration > 1 ? ' days' : ' day'    
                duration_text = duration + duration_text_unit
            } else {
                duration_text = 'Indefinite'
            }
            $(s.children('span')[1]).html(duration_text);
        })

        
        total_duration_units = total_duration > 1 || wfd_uncertainty ? ' days' : ' day'
        total_duration_uncertainty =  wfd_uncertainty ? '+ ' : ''
        total_duration_text = total_duration + total_duration_uncertainty + total_duration_units
        $(workflow_segment_last.children('span')[1]).html(total_duration_text)
        $(total_duration_span).html('Total: ' + total_duration_text)
    }

    /*
    *  For some reason the elements inside a workflow diagram segment
    *  does not line up well if the element is initially on display: none.
    *  We resort to just displaying everything first then hiding the
    *  segments which need to be hidden
    */
    function calc_workflow_steps() {
        if (enable_review_cb.is(':checked')) {
            show_review_time_field()
        } else {
            hide_review_wfd()
        }

        if (enable_approve_cb.is(':checked')) {
            show_approve_time_field()
        } else {
            hide_approve_wfd()
        }
    }

    function calc_autocreate_settings() {
        if (autocreate_cb.is(':checked')) {
            autocreate_settings_container.show()
        }
    }        

    function calc_wfd_time_labels() {

    }

    function init_workflow_settings() {
        calc_workflow_steps();
        calc_autocreate_settings();
        calc_wfd_spacing(wfd_container);
    };
    init_workflow_settings();

    /* 
     *  event handlers 
     */
    enable_review_cb.change(function() {
        if ($(this).is(':checked')) {
            show_review_time_field();
            show_review_wfd();
        } else {
            hide_review_time_field();

            review_time_input.val('')
            wfd_review.data('duration', '')
            hide_review_wfd();
        }
        calc_wfd_spacing(wfd_container);
    });

    enable_approve_cb.change(function() {
        if ($(this).is(':checked')) {
            show_approve_time_field();
            show_approve_wfd();
        } else {
            hide_approve_time_field();

            approve_time_input.val('')
            wfd_approve.data('duration', '')
            hide_approve_wfd();
        }
        calc_wfd_spacing(wfd_container);
    });

    subtitle_time_input.change(function() {
        wfd_transcribe.data('duration', parseInt(this.value))
        calc_wfd_spacing(wfd_container)
    })

    review_time_input.change(function() {
        wfd_review.data('duration', parseInt(this.value))
        calc_wfd_spacing(wfd_container)
    })

    approve_time_input.change(function() {
        wfd_approve.data('duration', parseInt(this.value))
        calc_wfd_spacing(wfd_container)
    })

    autocreate_cb.change(function () {
        if ($(this).is(':checked')) {
            autocreate_settings_container.show()
        } else {
            autocreate_settings_container.hide()
        }
    });

    $(window).on('resize', function() {
        calc_wfd_spacing(wfd_container)
    })
});

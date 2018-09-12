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

$.behaviors('.workflowDiagramContainer', function(container) {
    var container = $(container);
    var container_width = container.width()
    var workflow_segments = container.find('.workflowStep')
    var workflow_segment_last = container.find('.last')

    /* total width of the svg triangle and "gap" 
       used to separate segments of the workflow diagram */
    var separator_width = 35 
    // total space occupied by the separators
    var separator_space = workflow_segments.length * separator_width
    
    var total_duration = calc_total_duration() 
    // total available space for the segments to occupy
    var segments_space = calc_segments_space()
    var last_space = calc_last_space()
    calc_spacing()

    /* we always allocate the last 1/3 of the space for the Complete step */
    function calc_segments_space() {
        var segments_space = Math.floor(container_width * 0.67)
        var separator_space = separator_width * workflow_segments.length
        return segments_space - separator_space
    }

    function calc_total_duration() {
        var total_duration = 0
        $.each(workflow_segments, function(i, segment) {
            total_duration += $(segment).data('duration')
        })
        return total_duration
    }

    function calc_last_space() {
        var last_space = Math.floor(container_width * 0.33)
        return last_space - separator_space
    }

    function calc_spacing() {
        var spaces = []

        $.each(workflow_segments, function(i, segment) {
            var duration = $(segment).data('duration')
            spaces.push(Math.floor(segments_space * (duration / total_duration)))
        })

        $.each(workflow_segments, function(i, segment) {
            var s = $(segment)
            s.outerWidth(spaces[i])

            var duration = s.data('duration')
            var duration_text_unit = duration > 1 ? ' days' : ' day'
            var duration_text = duration + duration_text_unit
            $(s.children('span')[1]).html(duration_text);
        })
    }
});

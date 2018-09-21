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
    
    /*
     * function call to calculate the spacing
     */
    calc_spacing(container)

    /*
     * function definitions
     */

    function calc_total_duration(workflow_segments) {
        var total_duration = 0
        $.each(workflow_segments, function(i, segment) {
            total_duration += $(segment).data('duration')
        })
        return total_duration
    }

    function calc_spacing(container) {
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
            var duration_text_unit = duration > 1 ? ' days' : ' day'
            var duration_text = duration + duration_text_unit
            $(s.children('span')[1]).html(duration_text);
        })

        total_duration_units = total_duration > 1 ? ' days' : ' day'
        $(workflow_segment_last.children('span')[1]).html(total_duration + total_duration_units)
    }

    $(window).on('resize', function() {
        calc_spacing(container)
    })
});

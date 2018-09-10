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

$ = require('jquery');

$.behaviors('.listView', listView);

function listView(container) {
    container = $(container);
    var cells = container.children().not('.listView-secondaryRow');
    var columnCount = calcColumnCount();
    var hoverRow = undefined;
    var expandedRow = undefined;

    setupCellRows();
    cells.mouseenter(function() {
        onRowHover($(this).data('row'));
    });
    container.mouseleave(function() {
        onRowHover(undefined);
    });

    $('.listView-expand', container).click(function(evt) {
        toggleRowExpanded($(this).closest(cells).data('row'));
        evt.preventDefault();
    });

    function calcColumnCount() {
        var columnSpec = container.css('grid-template-columns').split(/\s+/);
        var realColumns = columnSpec.filter(function(spec) {
            return spec.trim()[0] != '[';
        });
        return realColumns.length;
    }


    function onRowHover(row) {
        if(row == hoverRow) {
            return;
        }
        $('.listView-action', cellsForRow(hoverRow)).removeClass('visible');
        $('.listView-action', cellsForRow(row)).addClass('visible');
        hoverRow = row;
    }

    function toggleRowExpanded(row) {
        if(expandedRow == row) {
            row = undefined; // if the row is already expanded, then collapse it
        }
        collapseRow(expandedRow);
        expandRow(row);
        expandedRow = row;
    }

    var expandAnimationTime = 250;

    function expandRow(row) {
        var cells = cellsForRow(row);
        cells.addClass('expanded');
        var secondaryData = $('.listView-secondary', cells); // extra data inside each column
        var secondaryRow = cells.filter('.listView-secondaryRow'); // extra row at the end of each column

        secondaryRow.slideDown(expandAnimationTime);
        secondaryData.slideDown(expandAnimationTime);
    }

    function collapseRow(row) {
        var cells = cellsForRow(row);
        cells.removeClass('expanded');
        var secondaryData = $('.listView-secondary', cells); // extra data inside each column
        var secondaryRow = cells.filter('.listView-secondaryRow'); // extra row at the end of each column

        secondaryRow.slideUp(expandAnimationTime);
        secondaryData.slideUp(expandAnimationTime);
    }

    function cellsForRow(row) {
        if(row === undefined) {
            return $();
        }
        var rv = cells.slice(row * columnCount, row * columnCount + columnCount);
        // Add the secondary row, if it is present
        rv = rv.add(cells.eq(row * columnCount + columnCount - 1).next('.listView-secondaryRow'));
        return rv;
    }

    function handleMenuItemActivate(evt, action) {
        if(action == 'expand') {
            toggleRowExpanded(evt.data);
        }
    }

    function setupCellRows() {
        for(var i=0; ; i++) {
            var cells = cellsForRow(i);
            if(cells.length > 0) {
                cells.data('row', i);
            } else {
                return;
            }
            $('.dropdownMenu', cells).on('link-activate', i, handleMenuItemActivate);
        }
    }
}

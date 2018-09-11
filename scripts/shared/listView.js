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
var keyCodes = require('./keyCodes');

$.behaviors('.listView', listView);

function listView(container) {
    container = $(container);
    var cells = container.children().not('.listView-secondaryRow');
    var columnCount = calcColumnCount();
    var rowCount = null;
    var headerRowCount = 0;
    var hoverRow = null;
    var expandedRow = null;
    var selectedRow = null;

    setupCellRows();

    cells.mouseenter(function() {
        onRowHover($(this).data('row'));
    });
    container.mouseleave(function() {
        onRowHover(null);
    })
    container.on('keydown', function(evt) {
        if(evt.which == keyCodes.up) {
            selectPreviousRow();
            evt.preventDefault();
        } else if(evt.which == keyCodes.down) {
            selectNextRow();
            evt.preventDefault();
        } else if(evt.which == keyCodes.space) {
            toggleCheckbox();
            evt.preventDefault();
        } else if(evt.which == keyCodes.enter) {
            activateMenu();
            evt.preventDefault();
        } else if(evt.ctrlKey && String.fromCharCode(evt.which).toLowerCase() == 'a') {
            selectAll();
            evt.preventDefault();
        }
    }).on('focusout', removeSelectedStyles).on('focusin', addSelectedStyles);

    $('.dropdownMenu', container).on('focus-button', function() {
        // When we hide dropdowns inside the listview, don't focus the button.
        // Instead, focus the listView, so the user can continue working with
        // it.
        container.focus();
        return false;
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
        $('.listView-action', cellsForRow(hoverRow)).removeClass('hover');
        $('.listView-action', cellsForRow(row)).addClass('hover');
        hoverRow = row;
    }

    function toggleRowExpanded(row) {
        if(expandedRow == row) {
            row = null; // if the row is already expanded, then collapse it
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
        var expandIcon = $('.listView-expand', cells);

        expandIcon.addClass('text-plum');
        secondaryRow.slideDown(expandAnimationTime);
        secondaryData.slideDown(expandAnimationTime);
    }

    function collapseRow(row) {
        var cells = cellsForRow(row);
        cells.removeClass('expanded');
        var secondaryData = $('.listView-secondary', cells); // extra data inside each column
        var secondaryRow = cells.filter('.listView-secondaryRow'); // extra row at the end of each column
        var expandIcon = $('.listView-expand', cells);

        expandIcon.removeClass('text-plum');
        secondaryRow.slideUp(expandAnimationTime);
        secondaryData.slideUp(expandAnimationTime);
    }

    function cellsForRow(row) {
        if(row === null) {
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
                if(cells.is('.listView-header')) {
                    headerRowCount = i + 1;
                }
            } else {
                rowCount = i;
                return;
            }
            $('.dropdownMenu', cells).on('link-activate', i, handleMenuItemActivate);
        }
    }


    function selectNextRow() {
        if(selectedRow === null) {
            selectRow(headerRowCount);
        } else if(selectedRow + 1 < rowCount) {
            selectRow(selectedRow + 1);
        } else {
            selectRow(null);
        }
    }

    function selectPreviousRow() {
        if(selectedRow === null) {
            selectRow(rowCount - 1);
        } else if(selectedRow - 1 >= headerRowCount) {
            selectRow(selectedRow - 1);
        } else {
            selectRow(null);
        }
    }

    function selectRow(row) {
        removeSelectedStyles();
        selectedRow = row;
        addSelectedStyles();
    }

    function removeSelectedStyles() {
        var cells = cellsForRow(selectedRow);
        cells.first().removeClass('selected');
        $('.listView-action', cells).last().removeClass('selected');
    }

    function addSelectedStyles() {
        var cells = cellsForRow(selectedRow);
        cells.first().addClass('selected');
        $('.listView-action', cells).last().addClass('selected');
    }

    function toggleCheckbox() {
        var checkbox = $(':checkbox', cellsForRow(selectedRow).filter('.listView-checkbox'));
        checkbox.prop('checked', !checkbox.prop('checked')).trigger('change');
    }

    function activateMenu() {
        var action = $('.listView-action', cellsForRow(selectedRow)).last();
        if(action.data('menu')) {
            action.trigger('key-activate');
        } else {
            action.click();
        }
    }

    function selectAll() {
        var checkAll = $('.checkAll', container);
        checkAll.prop('checked', !checkAll.prop('checked')).trigger('change');
    }

}

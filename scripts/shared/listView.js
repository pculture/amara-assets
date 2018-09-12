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

// ListView is fairly complicated, so we split up the implentation into several parts:
//
//   ListViewDOM       -- Tracks the various HTML elements inside list view (cells, rows, action buttons, etc).
//   ListViewExpansion -- Handles expanding rows
//   ListViewMouse     -- Handle mouse hover
//   ListViewKeys      -- Handle keyboard controls


function ListViewDOM(elt) {
    this.elt = $(elt);
    this.cells = this.elt.children().not('.listView-secondaryRow');
    this.columnCount = this.calcColumnCount();
    this.headerRowCount = 0;
    this.rowCount = 0;
    this.checkAll = $('.checkAll', elt);
    this.dropdownMenus = $('.dropdownMenu', elt);
    this.dropdownMenusByRow = {};
    this.showDetailsByRow = {};
    this.expandButtons = $('.listView-expand', elt);
    this.walkCells();
}

ListViewDOM.prototype = {
    calcColumnCount: function() {
        var columnSpec = this.elt.css('grid-template-columns');
        // Crazy regex, but it should split the css into parts
        columnSpec = columnSpec.match(/[^ (]+(\([^)]+\))?/g)
        var realColumns = columnSpec.filter(function(spec) {
            return spec.trim()[0] != '[';
        });
        return realColumns.length;
    },
    walkCells: function() {
        for(var i=0; ; i++) {
            var cells = this.cellsForRow(i);
            if(cells.length == 0) {
                return;
            }
            cells.data('row', i);
            this.rowCount++;
            if(cells.is('.listView-header')) {
                this.headerRowCount++;
            }
            this.dropdownMenusByRow[i] = $('.dropdownMenu', cells);
            this.showDetailsByRow[i] = $('.listView-showDetails', cells);
        }
    },
    cellsForRow: function(row) {
        if(row === null) {
            return $();
        }
        var start = row * this.columnCount;
        var end = start + this.columnCount;
        var rv = this.cells.slice(start, end);
        // Add the secondary row, if it is present
        rv = rv.add(this.cells.eq(end - 1).next('.listView-secondaryRow'));
        return rv;
    },
    actionsForRow: function(row) {
        return $('.listView-action', this.cellsForRow(row));
    },
    checkboxForRow: function(row) {
        return $(':checkbox', this.cellsForRow(row).filter('.listView-checkbox'));
    },
    calcRow: function(elt) {
        // Calulate which row an element is in
        return $(elt).closest(this.cells).data('row');
    }
};

function ListViewExpansion(dom) {
    this.dom = dom;
    this.expandedRow = null;

    this.dom.expandButtons.on('click', this.onExpandClick.bind(this));
    _.each(this.dom.dropdownMenusByRow, function(menu, row) {
        menu.on('link-activate', null, row, this.onLinkActivate.bind(this));
    }, this);
}

ListViewExpansion.prototype = {
    toggleRowExpanded: function(row) {
        if(this.expandedRow == row) {
            row = null; // if the row is already expanded, then collapse it
        }
        this.collapseRow(this.expandedRow);
        this.expandRow(row);
        this.expandedRow = row;
    },
    expandRow: function(row) {
        var cells = this.dom.cellsForRow(row);
        cells.addClass('expanded');

        $('.listView-secondary', cells).slideDown(250);
        cells.filter('.listView-secondaryRow').slideDown(250);
        $('.listView-expand', cells).addClass('text-plum');
        this.updateShowDetailsText(row, gettext('Hide Details'));
    },
    collapseRow: function(row) {
        var cells = this.dom.cellsForRow(row);
        cells.removeClass('expanded');

        $('.listView-secondary', cells).slideUp(250);
        cells.filter('.listView-secondaryRow').slideUp(250);
        $('.listView-expand', cells).removeClass('text-plum');
        this.updateShowDetailsText(row, gettext('Show Details'));
    },
    updateShowDetailsText: function(row, text) {
        if(row != null && this.dom.showDetailsByRow[row].length > 0) {
            $('.dropdownMenu-text', this.dom.showDetailsByRow[row]).text(text);
        }
    },
    onExpandClick: function(evt) {
        this.toggleRowExpanded(this.dom.calcRow(evt.target));
        evt.preventDefault();
    },
    onLinkActivate: function(evt, action) {
        if(action == 'expand') {
            this.toggleRowExpanded(evt.data);
        }
    }
};

function ListViewMouse(dom) {
    this.dom = dom;
    this.hoverRow = null;

    dom.cells.mouseenter(this.onMouseEnterCell.bind(this));
    dom.elt.mouseleave(this.onMouseLeaveListView.bind(this));
}

ListViewMouse.prototype = {
    onMouseEnterCell: function(evt) {
        this.setHoverRow($(evt.target).data('row'));
    },
    onMouseLeaveListView: function(evt) {
        this.setHoverRow(null);
    },
    setHoverRow: function(row) {
        if(row == this.hoverRow) {
            return;
        }
        this.dom.actionsForRow(this.hoverRow).removeClass('hover');
        this.dom.actionsForRow(row).addClass('hover');
        this.hoverRow = row;
    }
};

function ListViewKeys(dom) {
    this.dom = dom;
    this.selectedRow = null;

    dom.elt.on('keydown', this.onKeyDown.bind(this));
    dom.elt.on('focusout', this.onFocusOut.bind(this));
    dom.elt.on('focusin', this.addSelectedStyles.bind(this));
    this.dom.dropdownMenus.on('focus-button', this.onDropdownMenuFocusButton.bind(this));
}

ListViewKeys.prototype = {
    onKeyDown: function(evt) {
        if(evt.which == keyCodes.up) {
            this.selectPreviousRow();
        } else if(evt.which == keyCodes.down) {
            this.selectNextRow();
        } else if(evt.which == keyCodes.space) {
            this.toggleCheckbox();
        } else if(evt.which == keyCodes.enter) {
            this.activateMenu();
        } else if(evt.ctrlKey && String.fromCharCode(evt.which).toLowerCase() == 'a') {
            this.selectAll();
        } else {
            // Unhandled key, return now to avoid calling preventDefault();
            return;
        }
        evt.preventDefault();
    },
    selectNextRow: function() {
        if(this.selectedRow === null) {
            this.selectRow(this.dom.headerRowCount);
        } else if(this.selectedRow + 1 < this.dom.rowCount) {
            this.selectRow(this.selectedRow + 1);
        } else {
            this.selectRow(null);
        }
    },
    selectPreviousRow: function() {
        if(this.selectedRow === null) {
            this.selectRow(this.dom.rowCount - 1);
        } else if(this.selectedRow - 1 >= this.dom.headerRowCount) {
            this.selectRow(this.selectedRow - 1);
        } else {
            this.selectRow(null);
        }
    },
    selectRow: function(row) {
        this.removeSelectedStyles();
        this.selectedRow = row;
        this.addSelectedStyles();
    },
    removeSelectedStyles: function() {
        this.dom.cellsForRow(this.selectedRow).first().removeClass('selected');
        this.dom.actionsForRow(this.selectedRow).last().removeClass('selected');
    },
    onFocusOut: function(evt) {
        if($(evt.relatedTarget).closest(this.dom.dropdownMenus).length == 0) {
            this.removeSelectedStyles();
        }
    },
    addSelectedStyles: function() {
        this.dom.cellsForRow(this.selectedRow).first().addClass('selected');
        this.dom.actionsForRow(this.selectedRow).last().addClass('selected');
    },
    toggleCheckbox: function() {
        var checkbox = this.dom.checkboxForRow(this.selectedRow);
        if(checkbox.length > 0) {
            checkbox.prop('checked', !checkbox.prop('checked')).trigger('change');
        }
    },
    activateMenu: function() {
        var action = this.dom.actionsForRow(this.selectedRow).last();
        if(action.data('menu')) {
            action.trigger('key-activate');
        } else {
            action.click();
        }
    },
    selectAll: function() {
        this.dom.checkAll.prop('checked', !this.dom.checkAll.prop('checked')).trigger('change');
    },
    onDropdownMenuFocusButton: function() {
        // When we hide dropdowns inside the listview, don't focus the button.
        // Instead, focus the listView, so the user can continue working with
        // it.
        this.dom.elt.focus();
        return false;
    }
};

function listView(elt) {
    var dom = new ListViewDOM(elt);
    var expansion = new ListViewExpansion(dom);
    var mouse = new ListViewMouse(dom);
    var keys = new ListViewKeys(dom);

}

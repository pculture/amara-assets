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
var _ = require('underscore');
var ajax = require('./ajax');
var querystring = require('./querystring');
var keyCodes = require('./keyCodes');

var longTouchDelay = 500;

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
    this.columnCount = parseInt(this.elt.css('column-count'));
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
    activateMainAction: function(row) {
        var action = this.actionsForRow(row).last();
        if(action.data('menu')) {
            action.trigger('key-activate');
        } else {
            action.click();
        }
    },
    activateMainActionFromClick: function(row, evt) {
        var action = this.actionsForRow(row).last();
        if(action.data('menu')) {
            action.data('menu').dropdown('show', { event: evt });
        } else {
            action.click();
        }
    },
    checkboxForRow: function(row) {
        return $(':checkbox', this.cellsForRow(row).filter('.listView-checkbox'));
    },
    calcRow: function(elt) {
        // Calulate which row an element is in
        return $(elt).closest(this.cells).data('row');
    },
    selectionCheckboxValueForRow: function(row) {
        return $('input[name=selection]', this.cellsForRow(row)).val();
    }
};

function ListViewExpansion(dom) {
    this.dom = dom;
    this.expandedRow = null;

    this.dom.expandButtons.on('click', this.onExpandClick.bind(this));
    _.each(this.dom.dropdownMenusByRow, function(menu, row) {
        menu.on('link-activate', null, parseInt(row), this.onLinkActivate.bind(this));
    }, this);
}

ListViewExpansion.prototype = {
    toggleRowExpanded: function(row) {
        if(this.expandedRow == row) {
            row = null; // if the row is already expanded, then collapse it
        }
        if(this.expandedRow) {
            this.collapseRow(this.expandedRow);
        }
        if(row) {
            this.expandRow(row);
        }
        this.expandedRow = row;
    },
    expandRow: function(row) {
        var cells = this.dom.cellsForRow(row);
        cells.addClass('expanded');

        $('.listView-secondary', cells).slideDown(250);
        cells.filter('.listView-secondaryRow').slideDown(250);
        $('.listView-expand', cells).addClass('text-plum');
        this.updateShowDetailsText(row, gettext('Hide Details'));
        this.dom.elt.trigger($.Event('row-expanded', { row: row}));
    },
    collapseRow: function(row) {
        var cells = this.dom.cellsForRow(row);
        cells.removeClass('expanded');

        $('.listView-secondary', cells).slideUp(250);
        cells.filter('.listView-secondaryRow').slideUp(250);
        $('.listView-expand', cells).removeClass('text-plum');
        this.updateShowDetailsText(row, gettext('Show Details'));
        this.dom.elt.trigger($.Event('row-collapsed', { row: row}));
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
    this.touchTimer = null;
    this.touchStartEvt = null;
    this.sawTouch = false
    this.showedContextMenu = false;

    dom.cells.mouseenter(this.onMouseEnterCell.bind(this));
    dom.elt.mouseleave(this.onMouseLeaveListView.bind(this));
    dom.cells.on('touchstart', this.onTouchStart.bind(this));
    dom.cells.on('touchend', this.onTouchEnd.bind(this));
    dom.cells.on('touchcancel', this.onTouchCancel.bind(this));
    dom.cells.on('touchmove', this.onTouchMove.bind(this));
}

ListViewMouse.prototype = {
    onMouseEnterCell: function(evt) {
        // Enable the hover CSS, only if we're not on a touch device.  For
        // those we get mouseenter events when the user touches a row, which
        // feels weird..
        if(!this.sawTouch) {
            this.setHoverRow($(evt.target).data('row'));
        }
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
    },
    onTouchStart: function(evt) {
        this.sawTouch = true;
        if(evt.touches.length == 1) {
            this.touchStartEvt = evt;
            this.startTouchTimer();
            $(window).on('contextmenu.listviewmouse', function(evt) {
                // Prevent the default context menu since we're going to present our own
                evt.preventDefault();
                evt.stopPropagation();
            });
        }
        this.showedContextMenu = false;
    },
    onTouchEnd: function(evt) {
        this.cancelTouchTimer();
        $(window).off('contextmenu.listviewmouse');
        this.showedContextMenu = false;
    },
    onTouchCancel: function(evt) {
        this.onTouchEnd(evt);
    },
    onTouchMove: function(evt) {
        this.cancelTouchTimer();
        if(this.showedContextMenu) {
            evt.preventDefault();
        }
    },
    startTouchTimer: function() {
        this.cancelTouchTimer();
        this.touchTimer = setTimeout(this.onTouchTimer.bind(this), longTouchDelay);
    },
    cancelTouchTimer: function() {
        if(this.touchTimer) {
            clearTimeout(this.touchTimer);
        }
        this.touchTimer = null;
    },
    onTouchTimer: function() {
        this.touchTimer = null;
        this.showedContextMenu = true;
        var row = this.dom.calcRow(this.touchStartEvt.target);
        this.dom.activateMainActionFromClick(row, this.touchStartEvt);
    }
};

function ListViewKeys(dom) {
    this.dom = dom;
    this.selectedRow = null;

    dom.elt.on('keydown', this.onKeyDown.bind(this));
    dom.elt.on('focusout', this.onFocusOut.bind(this));
    dom.elt.on('focusin', this.addSelectedStyles.bind(this));
    dom.elt.on('row-expanded', this.onRowExpanded.bind(this));
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
        this.dom.activateMainAction(this.selectedRow);
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
    },
    onRowExpanded: function(evt) {
        // If there is a currently expanded row, change it to the expanded one
        if(this.selectedRow) {
            this.selectRow(evt.row);
        }
    }
};

function ListViewLinkHandler(dom) {
    this.dom = dom;
    this.dom.dropdownMenus.on('link-activate', this.onLinkActivate.bind(this));
}

ListViewLinkHandler.prototype = {
    onLinkActivate: function(evt, arg1, arg2, arg3) {
        if(arg1 == 'listview-form') {
            var row = this.dom.calcRow(evt.openerButton);
            if(evt.openerButton && evt.openerButton.data('selection')) {
                // selection hard-coded on the dropdown button
                var selection = evt.openerButton.data('selection');
            } else {
                // calculate the selection based on the checkbox for the row
                var selection = this.dom.selectionCheckboxValueForRow(row);
            }
            if(selection) {
                var url = '?' + querystring.format({
                    form: arg2,
                    selection: selection
                });
                ajax.update(url, {
                    keepState: true
                });
            }
        }
    }
};

function listView(elt) {
    var dom = new ListViewDOM(elt);
    var expansion = new ListViewExpansion(dom);
    var mouse = new ListViewMouse(dom);
    var keys = new ListViewKeys(dom);
    var linkHandler = new ListViewLinkHandler(dom);

}

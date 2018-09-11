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
    var cells = container.children();
    var columnCount = calcColumnCount();
    var hoverRow = -1;

    cells.mouseenter(function() {
        onRowHover(Math.floor($(this).index() / columnCount));
    });
    container.mouseleave(function() {
        onRowHover(-1);
    });

    function calcColumnCount() {
        for(var i = 0; i < 10; i++) {
            if(container.hasClass('columns-' + i)) {
                return i;
            }
        }
        return 1;
    }

    function onRowHover(row) {
        console.log('onRowHover ', row);
        if(row == hoverRow) {
            return;
        }
        $('.listView-action', cellsForRow(hoverRow)).removeClass('visible');
        $('.listView-action', cellsForRow(row)).addClass('visible');
        hoverRow = row;
    }

    function cellsForRow(row) {
        if(row == -1) {
            return $();
        }
        return cells.slice(row * columnCount, row * columnCount + columnCount);
    }
}

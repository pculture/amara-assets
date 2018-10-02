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


// This module contains code to update filters, things like the filterbox
// element, or a searchbar.  When filters are changed we:
//
// - update the GET params in the browser location
// - remove the page paramater, since users expect to see the first page of
//   results when they change filters
// - do an AJAX request to update the page

var querystring = require('./querystring');
var ajax = require('./ajax');

module.exports = {
    // Add a new filter.  value can either be a single value or a list of values
    add: function(name, value) {
        var params = querystring.parseList();
        params[name] = value;
        delete params.page;
        ajax.update('?' + querystring.format(params));
    },
    // Add a remove filter.  Pass in a value to remove a single filter, or leave it out to remove all filters for name
    remove: function(name, value) {
        var params = querystring.parseList();
        var values = params[name];
        if(values === undefined) {
            return;
        }
        if(value === undefined) {
            values = [];
        } else {
            var index = values.indexOf(value);
            if(index > -1) {
                values.splice(index, 1);
            }
        }
        if(values.length > 0) {
            params[name] = values;
        } else {
            delete params[name];
        }
        delete params.page;
        ajax.update('?' + querystring.format(params));
    },
    // Clear all filters
    clear: function() {
        ajax.update('?');
    }
};

/* Amara, universalsubtitles.org
 *
 * Copyright (C) 2015 Participatory Culture Foundation
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

//
// querystring -- querystring paramater code
//

var _ = require('underscore');

function iterQuerystring(callback) {
    var queryString = window.location.search.substr(1);
    $.each(queryString.split('&'), function(i, pair) {
        if (pair === "") return;
        var parts = pair.split("=");
        var name = parts[0];
        var value = parts[1] && decodeURIComponent(parts[1].replace(/\+/g, " "));
        callback(name, value);
    });
}

module.exports = {
    parse: function() {
        var params = {};
        iterQuerystring(function(name, value) {
            params[name] = value;
        });
        return params;
    },
    parseList: function() {
        var params = {};
        iterQuerystring(function(name, value) {
            if(params[name] === undefined) {
                params[name] = [value];
            } else {
                params[name].push(value);
            }
        });
        return params;
    },
    format: function(data) {
        var parts = [];
        if(Array.isArray(data)) {
            _.each(data, function(param) {
                parts.push(param.name + '=' + encodeURIComponent(param.value));
            });
        } else {
            _.each(data, function(value, key) {
                if(Array.isArray(value)) {
                    _.each(value, function(singleValue) {
                        parts.push(key + '=' + encodeURIComponent(singleValue));
                    });
                } else {
                    parts.push(key + '=' + encodeURIComponent(value));
                }
            });
        }
        return parts.join('&');
    }

};

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

module.exports = {
    parse: function() {
        var queryString = window.location.search.substr(1);
        var params = {};
        $.each(queryString.split('&'), function(i, pair) {
            if (pair === "") return;
            var parts = pair.split("=");
            params[parts[0]] = parts[1] && decodeURIComponent(parts[1].replace(/\+/g, " "));
        });
        return params;
    }
};

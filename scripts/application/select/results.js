/*
 * Amara, universalsubtitles.org
 *
 * Copyright (C) 2016 Participatory Culture Foundation
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

/*
 * select/results.js -- amara results adapter
 */

var $ = require('jquery');
var _ = require('underscore');
var s2require = $.fn.select2.amd.require;

Utils = s2require('select2/utils');
ResultsList = s2require('select2/results');
HidePlaceHolder = s2require('select2/dropdown/hidePlaceholder');

// AddExtraBorder adds the border attribute to the between the last regular option and the first extra option.
function AddExtraBorder(decorated, $element, options, dataAdapter) {
    decorated.call(this, $element, options, dataAdapter);
    this.sawRegularResult = false;
    this.addedBorder = false;
}

AddExtraBorder.prototype.clear = function(decorated) {
    this.sawRegularResult = false;
    this.addedBorder = false;
    return decorated.call(this);
}

AddExtraBorder.prototype.append = function(decorated, data) {
    var self = this;
    _.each(data.results, function(result) {
        if(result.extra) {
            if(self.sawRegularResult && !self.addedBorder) {
                result.border = true;
                self.addedBorder = true;
            }
        } else {
            self.sawRegularResult = true;
        }
    });
    return decorated.call(this, data);
}

module.exports = function makeResultsAdapter(select) {
    var adapter = ResultsList;
    if(select.data('placeholder')) {
        adapter = Utils.Decorate(adapter, HidePlaceHolder);
    }
    adapter = Utils.Decorate(adapter, AddExtraBorder);
    return adapter;
}

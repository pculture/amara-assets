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
 * select/data.js -- select2 data adapters
 *
 * We define 2 data adapters:
 *   - AmaraArrayData, which extends the default select2 array data adapter
 *   - AmaraAjaxData, which extends the default select2 ajax data adapter
 *
 * Both add support of extraOptions, which are special options to display at
 * the bottom of the select for things like clearing the value, or unassigning
 * a user in assignment search field.  These get displayed specially.  They
 * also handle the updateExtraOptions event to dynamically change the extra
 * options that get displayed
 * 
 * The module returns a function to select the correct data adapter class based
 * on the select element.
 */
var $ = require('jquery');
var _ = require('underscore');
var s2require = $.fn.select2.amd.require;

var Utils = s2require('select2/utils');
var ArrayData = s2require('select2/data/array');
var AjaxData = s2require('select2/data/ajax');
var Tags = s2require('select2/data/tags');
var Tokenizer = s2require('select2/data/tokenizer');

function AmaraArrayData($element, data) {
    AmaraArrayData.__super__.constructor.call(this, $element, data);

    if(data.options.extraOptions) {
        this.updateExtraOptions(data.options.extraOptions);
    }
    var self = this;
    $element.on('data:updateExtraOptions', function(evt, data) {
        self.updateExtraOptions(data.extraOptions);
    });
}
Utils.Extend(AmaraArrayData, ArrayData);
AmaraArrayData.prototype.updateExtraOptions = function(extraOptions) {
    if(this.extraOptions) {
        _.each(this.extraOptions, function(option) {
            option.remove();
        });
    }
    this.extraOptions = this.convertToOptions(makeExtraOptions(extraOptions));
    this.$element.prepend(this.extraOptions);
}

function AmaraAjaxData($element, data) {
    AmaraAjaxData.__super__.constructor.call(this, $element, data);
    this.extraOptions = makeExtraOptions(data.options.extraOptions);
    var self = this;
    $element.on('data:updateExtraOptions', function(evt, data) {
        self.extraOptions = makeExtraOptions(data.extraOptions);
    });
}
Utils.Extend(AmaraAjaxData, AjaxData);

AmaraAjaxData.prototype.query = function(params, callback) {
    if(!params.term || params.term.length < 1) {
        var results = this.filterOutExtraOptions(this.$element.select2('data'));
        results = this.extraOptions.concat(results);
        callback({
            results: results
        });
    } else {
        AmaraAjaxData.__super__.query.call(this, params, callback);
    }
}

AmaraAjaxData.prototype.filterOutExtraOptions = function(optionList) {
    var extraOptionsIds = {};
    _.each(this.extraOptions, function(option) {
        extraOptionsIds[option.id] = true;
    });
    return _.reject(optionList, function(option) {
        return extraOptionsIds[option.id];
    });
}

AmaraAjaxData.prototype.processResults = function(data, params) {
    data.results = data.results.concat(this.extraOptions);
    return data
}

function makeExtraOptions(extraOptions) {
    return _.map(extraOptions, function(option, i) {
        return {
            id: option[0],
            text: option[1],
            extra: true
        };
    });
}

module.exports = function makeDataAdapter(select) {
    if(select.data('ajax')) {
        var adapter = AmaraAjaxData;
    } else {
        var adapter = AmaraArrayData;
    }

    adapter = Utils.Decorate(adapter, Tags);
    adapter = Utils.Decorate(adapter, Tokenizer);
    return adapter;
}

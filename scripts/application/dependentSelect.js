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

var $ = require('jquery');
var _ = require('underscore');

$.behaviors('.dependentSelect', dependentSelect);

function dependentSelect(wrapper) {
    wrapper = $(wrapper);
    select = $('select', wrapper);
    var controllerField = $(wrapper.data('controller'));
    var originalOptions = $('option', select).clone();
    // convert all values in choiceMap to strings to match the <option> elements.
    var choiceMap = {};
    _.each(wrapper.data('choiceMap'), function(value, key) {
        choiceMap[key] = _.map(value, String);
    });
    console.log(choiceMap);

    controllerField.change(updateChoices);
    updateChoices();

    function updateChoices() {
        var currentValue = controllerField.val();
        var enabledChoices = choiceMap[currentValue];
        $('option', select).remove();
        originalOptions.each(function() {
            option = $(this);
            if(_.contains(enabledChoices, option.val())) {
                select.append(option.clone());
            }
        });
    }
}

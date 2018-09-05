/* Amara, universalsubtitles.org
 *
 * Copyright (C) 2017 Participatory Culture Foundation
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

$.behaviors('.dynamicHelpText', function(selector) {
    var selector = $(selector);
    var help_text = selector.siblings('.helpBlock')
    var choices_help_texts = selector.data('dynamic-choice-help-texts')

    selector.on('change', function() {
        help_text.html(choices_help_texts[this.value]);
    });
});

$.behaviors('.dynamicHelpTextRadio', function(selector) {
    var radio = $(selector);
    var help_text = radio.parents('.radio-dynamic-help-text').siblings('.helpBlock')

    radio.on('change', function() {
        help_text.html($(this).data('dynamic-help-text'))
    });
});

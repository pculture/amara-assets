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
_ = require('underscore');
position = require('./position');
querystring = require('./querystring');
select = require('./select/main');
ajax = require('./ajax');

$.behaviors('.filterBox', filterBox);

function filterBox(filterBox) {
    filterBox = $(filterBox);
    var dropdownMenu = $('.dropdownMenu', filterBox);
    var chooser = null;

    var singletons = filterBox.data('singletonFilters');
    if(!singletons) {
        singletons = [];
    } else {
        singletons = singletons.split();
    }

    var filtersContainer = $('<div class="filterBox-filters">').appendTo(filterBox);

    // create the clear all button
    var clearAllButton = $('<button class="filterBox-clearAllButton">').appendTo(filterBox);
    clearAllButton.text(gettext('Clear Filters '));
    clearAllButton.append('<span class="fa fa-times-circle">');
    clearAllButton.on('click', clearAllFilters);

    dropdownMenu.on('link-activate', function(evt, fieldName) {
        buildChooser(fieldName);
    }).on('show', function() {
        removeChooserIfShown();
    });

    function buildChooser(fieldName) {
        removeChooserIfShown();

        var inputSelector = ('[name=' + fieldName + ']');
        var sourceInput = $(inputSelector, filterBox);
        var select2 = Boolean(sourceInput.is('.select'));

        if(select2 && sourceInput.data('select2')) {
            sourceInput.select2('destroy');
        }
        var formField = sourceInput.closest('.form-group').clone();
        var input = $(inputSelector, formField);

        chooser = $('<div class="filterBox-chooser">');
        chooser.append($('<div class="filterBox-chooserField">').append(formField));
        var buttonContainer = $('<div class="filterBox-chooserActions">').appendTo(chooser);
        var cancelButton = $('<button class="filterBox-chooserAction borderless">').text(gettext('Cancel')).appendTo(buttonContainer);
        var applyButton = $('<button class="filterBox-chooserAction cta">').text(gettext('Apply')).appendTo(buttonContainer);
        $('body').append(chooser);

        if(select2) {
            select.initSelect(input);
        }

        cancelButton.click(removeChooserIfShown);
        applyButton.click(function() {
            removeChooserIfShown();
            addFilterToQuery(fieldName, input.val());
            addFilterElt(fieldName, input.val());
        });
        input.on('input change', function() {
            if(input.val() == '') {
                applyButton.prop('disabled', true);
                applyButton.addClass('disabled');
            } else {
                applyButton.prop('disabled', false);
                applyButton.removeClass('disabled');
            }
        }).change();

        position.below(chooser, filterBox);
        if(select2) {
            input.select2('focus');
        } else {
            input.focus();
        }
    }

    function removeChooserIfShown() {
        if(chooser) {
            chooser.remove();
            chooser = null;
        }
    }

    function addFilterToQuery(name, value) {
        var params = querystring.parseList();
        if(_.contains(singletons, name)) {
            // remove existing filters before adding a new one
            params = _.filter(params, function(param) {
                return param.name != name;
            });
        }
        params.push({name: name, value: value});
        ajax.update('?' + querystring.format(params));
    }

    function removeFilterFromQuery(name, value) {
        var params = _.filter(querystring.parseList(), function(param) {
            return param.name != name || param.value != value;
        });
        ajax.update('?' + querystring.format(params));
    }

    function addFilterElt(name, value) {
        if(_.contains(singletons, name)) {
            // remove existing filter elements before adding a new one
            filtersContainer.children().each(function() {
                var elt = $(this);
                if(elt.data('name') == name) {
                    elt.remove();
                }
            });
        }

        var elt = $('<div class="filterBox-filter">').text(
                labelForInput(name) + ': ' + labelForInputValue(name, value));
        var closeButton = $('<button class="filter-removeFilter">x</button>').appendTo(elt);
        elt.data('name', name);
        closeButton.on('click', function() { elt.remove(); updateHasFilters(); removeFilterFromQuery(name, value) });

        filtersContainer.append(elt);
        updateHasFilters();
    }

    function labelForInput(name) {
        var label = gettext('Unknown');

        $('.dropdownMenu-link', dropdownMenu).each(function() {
            var link = $(this);
            var activateArgs = link.data('activateArgs');
            if(activateArgs.length == 1 && activateArgs[0] == name) {
                label = link.text();
                return false;
            }
        });

        return label;
    }

    function labelForInputValue(name, value) {
        var input = $('[name=' + name + ']', filterBox);

        if(input.prop('name') == 'select') {
            return $('option[value=' + value + ']', input).text();
        } else {
            return value;
        }
    }

    function updateHasFilters() {
        if(filtersContainer.is(':empty')) {
            filterBox.removeClass('hasFilters');
        } else {
            filterBox.addClass('hasFilters');
        }
    }

    function clearAllFilters() {
        filtersContainer.empty();
        ajax.update('?');
        updateHasFilters();
    };

    // Add existing querystring args as filters
    _.each(querystring.parseList(), function(param) { addFilterElt(param.name, param.value) });
}


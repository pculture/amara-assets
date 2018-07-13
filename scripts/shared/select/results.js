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
Results = s2require('select2/results');
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

// PowerUserLanguageSelect handles the case where a user enters multiple language codes and hits enter
function PowerUserLanguageSelect(decorated, $element, options, dataAdapter) {
    decorated.call(this, $element, options, dataAdapter);
}
PowerUserLanguageSelect.prototype.bind = function(decorated, container, $container) {
    var self = this;
    var currentQuery = "";

    container.on('results:select', function(params) {
        var highlighted = self.getHighlightedResults();
        if(highlighted.length == 0) {
            self.tryMultipleSelect(container, currentQuery);
        }
    });
    container.on('query', function(params) {
        currentQuery = params.term;
    });
    return decorated.call(this, container, $container);
}

PowerUserLanguageSelect.prototype.tryMultipleSelect = function(decorated, container, currentQuery) {
    var self = this;
    var terms = currentQuery.split(/[,\s]+/);
    var options = container.$element.find('option');
    var toSelect = [];
    for(var i=0; i < terms.length; i++) {
        var term = terms[i];
        if(term == "") {
            continue;
        }
        var matches = options.filter(function() {
            return term == $(this).data().data.id
        });
        if(matches.length == 1) {
            toSelect.push(term);
        } else {
            // Only select things if every term has a match
            return;
        }
    }
    container.$element.val(toSelect).trigger('change');
    self.trigger('close');
}

// PowerUserUsernameSelect handles the case where a user enters multiple usernames and hits enter
function PowerUserUsernameSelect(decorated, $element, options, dataAdapter) {
    decorated.call(this, $element, options, dataAdapter);
}
PowerUserUsernameSelect.prototype.bind = function(decorated, container, $container) {
    var self = this;
    var currentQuery = "";

    container.on('results:select', function(params) {
        var highlighted = self.getHighlightedResults();
        if(highlighted.length == 0) {
            self.tryMultipleSelect(container, currentQuery);
        }
    });
    container.on('query', function(params) {
        currentQuery = params.term;
    });
    return decorated.call(this, container, $container);
}

PowerUserUsernameSelect.prototype.tryMultipleSelect = function(decorated, container, currentQuery) {
    var self = this;
    var terms = currentQuery.split(/[,\s]+/);
    var ajax_url = container.$element.data('ajax-username-multiple')

    $.ajax({
        method: "GET",
        url: ajax_url,
        data: {
            usernames: terms
        }
    }).done(function(result) {
        $.each(result.invitable, function(index, data) {
            var option = new Option(data['text'], data['id'], true, true);
            container.$element.append(option).trigger('change')
        })
        self.trigger('close');

        error_msgs = []
        unknown = result.unknown.join(", ")
        invited_already = result.invited_already.join(", ")
        member_already = result.member_already.join(", ")

        if (unknown) {
            error_msgs.push("Unknown user(s): " + unknown)
        }
        if (invited_already) {
            error_msgs.push("Already have an invite: " + invited_already)
        }
        if (member_already) {
            error_msgs.push("Team member already: " + member_already)
        }
        if (error_msgs.length > 0) {
            if (result.invitable.length > 0) {
                error_msgs.push("\n" + result.invitable.length + " user(s) will be added to the username selection box!")
            }
            alert(error_msgs.join("\n"))
        }

    })
}

module.exports = function makeResultsAdapter(select, options) {
    var adapter = Results;
    if(select.data('placeholder')) {
        adapter = Utils.Decorate(adapter, HidePlaceHolder);
    }
    adapter = Utils.Decorate(adapter, AddExtraBorder);
    if(options.type == 'language' && options.multiple) {
        adapter = Utils.Decorate(adapter, PowerUserLanguageSelect);
    }
    if(options.type == 'ajax-username-multiple' && options.multiple) {
        adapter = Utils.Decorate(adapter, PowerUserUsernameSelect);
    }
    return adapter;
}

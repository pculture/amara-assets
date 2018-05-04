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
 * select/languages.js -- handle language selects
 */

var $ = require('jquery');
var _ = require('underscore');

function languageChoiceData(select) {
  var data = [];
  var enabledSelections = select.data('languageOptions').split(" ");
  var exclude = select.data('exclude');
  var limitTo = select.data('limitTo');
  var flat = select.data('flat');

  if(select.data('initial') !== undefined) {
    var initial = select.data('initial').split(':');
  } else {
    var initial = [];
  }

  var choiceMaker = new LanguageChoiceMaker(initial, exclude, limitTo);

  function sectionEnabled(name) {
    return enabledSelections.indexOf(name) > -1;
  }
  if(sectionEnabled('null') && !select.attr('multiple')) {
    data.push({
      id: '',
      selected: _.contains(initial, '')
    });
  }
  if(flat) {
    data = data.concat(choiceMaker.makeChoices(allLanguages));
  } else {
    if(sectionEnabled('my')) {
      data.push({
        text: gettext('My Languages'),
        children: choiceMaker.makeChoices(userLanguages)
      });
    }
    if(sectionEnabled('popular')) {
      data.push({
        text: gettext('Popular Languages'),
        children: choiceMaker.makeChoices(popularLanguages)
      });
    }
    if(sectionEnabled('all')) {
      data.push({
        text: gettext('All Languages'),
        children: choiceMaker.makeChoices(allLanguages)
      });
    }
  }
  if(sectionEnabled('dont-set')) {
      addUnsetOption(gettext("Don't set"));
  } else if(sectionEnabled('unset')) {
      addUnsetOption(gettext("Unset"));
  }
  function addUnsetOption(text) {
      var choice = { id: 'null', text: text };
      if(flat) {
          data.push(choice);
      } else {
          data.push({
            text: gettext('Other'),
            children: [choice]
          });
      }
  }

  return data;
}

function arrayToMap(array) {
  var map = {};
  _.each(array, function(val) { map[val] = true; });
  return map;
}

function LanguageChoiceMaker(initial, exclude, limitTo) {
  this.initial = initial;
  if(exclude === undefined) {
    exclude = [];
  }
  if(limitTo === undefined) {
    limitTo = [];
    this.limitToEnabled = false;
  } else {
    this.limitToEnabled = true;
  }
  this.exclude = arrayToMap(exclude);
  this.limitTo = arrayToMap(limitTo);
  this.alreadyAdded = {};
}

LanguageChoiceMaker.prototype = {
  makeChoices: function(languages) {
    var choices = [];
    var self = this;
    _.each(languages, function(code) {
      if(self.alreadyAdded[code] || self.exclude[code] ||
          (self.limitToEnabled && !self.limitTo[code])) {
        return;
      }
      var choice = {
        id: code,
        text: getLanguageName(code)
      };
      if(_.contains(self.initial, code)) {
        choice.selected = 'selected';
      }
      choices.push(choice);
      self.alreadyAdded[code] = true;
    });
    return choices;
  }
};

function languageChoice(code) {
  return { id: code, text: getLanguageName(code), selected: code == this };
}

module.exports = {
  languageChoiceData: languageChoiceData
};

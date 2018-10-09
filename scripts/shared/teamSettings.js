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

$.behaviors('.teamMembershipSetting', function(selector) {
    var radio = $(selector)
    var roles = radio.closest('.form-group').siblings('.teamMembershipSettingRoles')

    // show the inviter roles checkboxes if membership_policy is by invitation
    if (radio.is(':checked') && radio.val() == 0) {
        roles.show();
    }
    
    radio.on('change', function() {
        if (this.value != 0) {
            roles.hide();
        } else {
            roles.show();
        }
    });
});

$.behaviors('div#subtitleVisibility', function(container) {
    var switches = $(container).find('input[type=checkbox]')
    var completed = $(container).find('input[name="subtitles_public"]')
    var drafts = $(container).find('input[name="drafts_public"]')
    var help_text = $(container).find('.helpBlock')

    function change_help_text() {
        if (drafts.is(':checked')) {
            help_text.html(gettext('All subtitles are visible to anyone.'))
        } else if (completed.is(':checked')) {
            help_text.html(gettext('In progress subtitles are visible to team members only.  Completed subtitles are visible to anyone.'))
        } else {
            help_text.html(gettext('All subtitles are visible only to team members.'))
        }
    }

    // compute the initial help text
    change_help_text();

    switches.on('change', function() {
        change_help_text();
    });
});

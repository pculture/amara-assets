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

$.behaviors('.team-permissionsTableDynamicRow', function(row) {
    row = $(row);
    var settingName = row.data('settingName');
    var spans = $('span.fa', row);
    var checkboxes = $('#team-permissionsForm input[name^=' + settingName + '_]');
    checkboxes.each(function(i) {
        $(this).on('change', i, handleChange);
    });

    function handleChange(evt) {
        var span = spans.eq(evt.data);
        var checked = $(this).prop('checked');
        span.toggleClass('text-lime fa-check', checked);
        span.toggleClass('text-amaranth fa-times', !checked);
    }
});

$.behaviors('.syncHistoryList-action-sync', function(btn) {
    var btn = $(btn);

    btn.on('click', function() {
        var btn = $(this)
        var icon_tooltip = btn.siblings('.syncHistoryIconTooltip')
        var icon = icon_tooltip.find('.syncHistoryIcon')
        var ajax_url = btn.data('ajax-url')
        var pk = btn.data('sl-pk')

        $.ajax({
            url: ajax_url,
            method: 'GET',
            data: { 'pk': pk },

            beforeSend: function() {
                // remove the previously existing icon
                icon.removeClass('fa-check')
                icon.removeClass('text-lime')
                icon.removeClass('fa-exclamation-triangle')
                icon.removeClass('text-amaranth')

                icon.addClass('fa-spinner fa-spin')
                icon_tooltip.attr('title', _('Subtitle export in progress'))
            },

            complete: function() {
                icon.removeClass('fa-spinner fa-spin')
            },

            success: function() {
                icon.addClass('fa-check text-lime')
                icon_tooltip.attr('title', _('Subtitle export successful'))
            },
            error: function() {
                icon.addClass('fa-exclamation-triangle text-amaranth')
                icon_tooltip.attr('title', _('Subtitle export failed'))
            }
        })

    });
});

$.behaviors('.syncSubtitlesYoutube', function(checkbox) {
    var sync_subtitles_checkbox = $(checkbox)
    var sync_metadata_container = sync_subtitles_checkbox.closest('.form-group').siblings('.syncMetadataYoutubeContainer')

    if (sync_subtitles_checkbox.is(':checked')) {
        sync_metadata_container.css('display', 'block')
    }

    sync_subtitles_checkbox.on('change', function() {
        if (sync_subtitles_checkbox.is(':checked')) {
            sync_metadata_container.show()
        } else {
            sync_metadata_container.hide()
        }
    })
});

$.behaviors('.videoFeedsList-import', function(btn) {
    var btn = $(btn);
    var icon = btn.find('span.fa');

    btn.on('click', function() {
        icon.removeClass('fa-cloud-download-alt');
        icon.addClass('fa-spinner fa-spin');
        icon.css('visibility', 'visible');
    });
});

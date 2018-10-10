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

$.behaviors('.saveChangesButton', function(button) {
    var form = $(button).closest('form');   
    var inputs = form.find(':input') ;

    var form_initial_data = JSON.stringify(form.serializeArray())

    /* use this if we want to hide the save button again if the changed form data
       is the same as the original form data before it was changed */
    function check_form_data(){
        form_new_data = JSON.stringify(form.serializeArray())

        if (form_initial_data != form_new_data) {
            $(button).css('visibility', 'visible')
        } else {
            $(button).css('visibility', 'hidden')
        }
    }

    function show_save_button() {
        $(button).css('visibility', 'visible')
    }

    inputs.on('input', show_save_button);
    inputs.on('change', show_save_button);
    inputs.on('customchange', show_save_button); // use this for form controls that normally do not fire 'change' or 'input'
});
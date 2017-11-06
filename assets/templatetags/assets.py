# Amara, universalsubtitles.org
#
# Copyright (C) 2017 Participatory Culture Foundation
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU Affero General Public License as
# published by the Free Software Foundation, either version 3 of the
# License, or (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU Affero General Public License for more details.
#
# You should have received a copy of the GNU Affero General Public License
# along with this program.  If not, see
# http://www.gnu.org/licenses/agpl-3.0.html.

from __future__ import absolute_import

import logging

from django import template
from django.conf import settings

logger = logging.getLogger(__name__)
register = template.Library()

if settings.DEBUG:
    @register.simple_tag
    def asset(path):
        return '/assets/' + path
elif settings.STATIC_URL:
    @register.simple_tag
    def asset(path):
        return settings.STATIC_URL + path
else:
    logger.warn("Neither DEBUG no STATIC_URL set, static assets "
                "can't be served")
    @register.simple_tag
    def asset(path):
        return path

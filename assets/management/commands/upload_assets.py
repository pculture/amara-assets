# Copyright 2017 Participatory Culture Foundation, All Rights Reserved

from cStringIO import StringIO
import datetime
import email
import gzip
import mimetypes
import os
import time

import boto3
from django.core.management.base import BaseCommand
from django.conf import settings

from assets import util

class Command(BaseCommand):
    help = """Upload assets media to S3 """

    def add_arguments(self, parser):
        parser.add_argument('--no-gzip', dest='gzip', action='store_false',
                            default=True, help="Don't gzip files")

    def handle(self, *args, **options):
        self.setup_connection()
        for dirname in os.listdir(util.dist_dir()):
            gzip = dirname in ('js', 'css')
            self.upload_asset_dir(dirname, gzip)

    def upload_asset_dir(self, dirname, gzip):
        dist_dir = util.dist_dir()
        path = os.path.join(dist_dir, dirname)
        for dirpath, dirs, files in os.walk(path):
            for filename in files:
                path = os.path.join(dirpath, filename)
                s3_path = os.path.relpath(path, dist_dir)
                self.upload_file(path, s3_path, gzip)

    def setup_connection(self):
        session = boto3.Session(
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            region_name='us-east-1')
        s3 = session.resource('s3')
        self.bucket = s3.Bucket(settings.STATIC_MEDIA_S3_BUCKET)

    def upload_file(self, path, s3_path, gzip):
        s3_path = '{}/{}'.format(settings.LAST_COMMIT_GUID, s3_path)
        with open(path) as f:
            content = f.read()
        kwargs = self.kwargs_for_file(path)
        if gzip:
            content = self.compress_string(content)
            kwargs['ContentEncoding'] = 'gzip'
        print('{}:{}'.format(settings.STATIC_MEDIA_S3_BUCKET, s3_path))
        self.bucket.put_object(
            Key=s3_path,
            Body=content,
            ACL='public-read',
            **kwargs)

    def compress_string(self, data):
        zbuf = StringIO()
        zfile = gzip.GzipFile(mode='wb', compresslevel=6, fileobj=zbuf)
        zfile.write(data)
        zfile.close()
        return zbuf.getvalue()

    def kwargs_for_file(self, path):
        kwargs = self.cache_forever_kwargs()
        content_type, encoding = mimetypes.guess_type(path)
        if content_type is not None:
            kwargs['ContentType'] = content_type
        return kwargs

    def cache_forever_kwargs(self):
        """Get kwargs for put_object to cache a resource "forever"

        Note that "forever" doesn't really mean forever, just a very long
        time.  We use the somewhat standard amount of 1-year for this.
        """
        return {
            'CacheControl': 'max-age %d' % (3600 * 24 * 365 * 1),
            'Expires': datetime.datetime.now() + datetime.timedelta(days=365),
        }

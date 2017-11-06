# Django assets app

We use this app to serve our assets.  There are two basic cases:

 - development: static files are served from the amara-assets/dist/ directory
 - production: static files are served S3

We could probably use the staticfiles app for this stuff, but we have alot of
legacy code that already depends on things like `settings.STATIC_URL`.  For now
at least, it's simpler to create a new app, with new settings variables.

## Settings

- `ASSET_URL` -- If set, we will serve files from an external site, using this
  as the base URL.  For amara.org this means serving them from S3.
- `DEBUG` -- If True, we will serve the files in the dist/ directory

## Refering to assets from django templates

```
{% load assets %}

{% asset "path/to/assets" %}
```

Note that the path to assets must be relative to dist dir.

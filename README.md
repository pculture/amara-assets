# amara-assets

This repo contains the media assets used by amara (images, CSS, JS, etc.).  We
include it as a submodule in the unisubs repo.

## Building

The assets are build using gulp.

For unisubs, the dev command has some subcommands to run nodejs in a docker
container (dev gulp and dev npm).  Please use that method, since it ensures
we're all useing the same nodejs version.

## Customizing

You can customize the build with env variables:

  - `JS_EXTENSIONS`: Extry entrypoints for application.js (comma separated)

For Amara, we use these to add extra JS from the amara-enterprise repo.

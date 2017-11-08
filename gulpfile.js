'use strict';

var browserify = require('browserify');
var buffer = require('gulp-buffer');
var changed = require('gulp-changed');
var debug = require('gulp-debug');
var del = require('del');
var gulp = require('gulp');
var path = require('path');
var pump = require('pump');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var source = require('vinyl-source-stream');
var tap = require('gulp-tap');
var uglify = require('gulp-uglify');
var gutil = require('gulp-util');

var paths = {
    images: 'img/**',
    fonts: 'fonts/**',
    css: 'scss/[^_]*.scss',
    js: [
        'scripts/head/head.js',
        'scripts/marketing/marketing.js',
        'scripts/application/application.js',
    ]

}
var dest_paths = {
    base: 'dist',
    images: 'dist/img/',
    fonts: 'dist/fonts/',
    css: 'dist/css/',
    js: 'dist/js/',
}

process.on('SIGINT', function() {
    process.exit(1);
});
process.on('SIGTERM', function() {
    process.exit(0);
});

gulp.task('clean', function(cb) {
    del(dest_paths.base);
});

gulp.task('images', function(cb) {
    pump([
        gulp.src(paths.images),
        changed(dest_paths.images),
        gulp.dest(dest_paths.images),
    ], cb);
});

gulp.task('fonts', function(cb) {
    pump([
        gulp.src(paths.fonts),
        changed(dest_paths.fonts),
        gulp.dest(dest_paths.fonts),
    ], cb);
});

gulp.task('css', function(cb) {
    pump([
        gulp.src(paths.css),
        sourcemaps.init(),
        sass({outputStyle: 'compressed'}).on('error', sass.logError),
        sourcemaps.write('./maps'),
        gulp.dest(dest_paths.css),
    ], cb);
});

gulp.task('js', function(task_cb) {
    var count = 0;
    function single_cb() {
        count += 1;
        if(count == paths.js.length) {
            task_cb();
        }
    }
    paths.js.forEach(function(script) {
        run_browserify(script, false, single_cb);
    });
});

function run_browserify(script, watch, cb) {
    var opts = {debug: true, cache: {}, pluginCache: {}};
    var filename = path.basename(script);

    var b = browserify(script, opts);

    if(watch) {
        var watchify = require('watchify');
        b.plugin(watchify);
        b.on('update', function() {
            console.log('updating ' + script);
            run(function() {
                console.log('finished building ' + script);
            });
        });
    }
    b.transform("browserify-shim");
    run(cb);

    function run(cb) {
        pump([
            b.bundle().on('error', function(err) {
                gutil.log(err.name + ': ' + err.message)
            }),
            source(filename),
            buffer(),
            sourcemaps.init({loadMaps: true}),
            uglify({compress: {drop_debugger: false}}),
            sourcemaps.write('./maps'),
            gulp.dest(dest_paths.js),
        ], cb);
    }
}

gulp.task('build', ['images', 'fonts', 'css', 'js']);
gulp.task('watch', function () {
    gulp.watch(paths.images, ['images']);
    gulp.watch(paths.fonts, ['fonts']);
    gulp.watch('scss/**', ['css']);
    paths.js.forEach(function(script) {
        run_browserify(script, true);
    });
});
gulp.task('default', ['build', 'watch']);


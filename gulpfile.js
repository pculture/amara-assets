'use strict';

var browserify = require('browserify');
var buffer = require('gulp-buffer');
var changed = require('gulp-changed');
var debug = require('gulp-debug');
var del = require('del');
var gulp = require('gulp');
var pump = require('pump');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var tap = require('gulp-tap');
var util = require('gulp-util');

var paths = {
    images: 'img/**',
    fonts: 'fonts/**',
    css: 'scss/[^_]*.scss',
    js: [
        'scripts/head.js',
        'scripts/marketing.js',
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

gulp.task('js', function(cb) {
    pump([
        gulp.src(paths.js),
        tap(function (file) {
            file.contents = browserify(file.path, {debug: true}).bundle();
        }),
        buffer(),
        sourcemaps.init({loadMaps: true}),
        uglify(),
        sourcemaps.write('./maps'),
        gulp.dest(dest_paths.js),
    ], cb);
});

gulp.task('build', ['images', 'fonts', 'css', 'js']);
gulp.task('watch', function () {
    gulp.watch(paths.images, ['images']);
    gulp.watch(paths.fonts, ['fonts']);
    gulp.watch('scss/**', ['css']);
    gulp.watch('scripts/**', ['js']);
});
gulp.task('default', ['build', 'watch']);


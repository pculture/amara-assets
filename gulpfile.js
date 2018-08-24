'use strict';

var log = require('fancy-log');
var browserify = require('browserify');
var debug = require('gulp-debug');
var del = require('del');
var fs = require('fs');
var glob = require('glob');
var gulp = require('gulp');
var newer = require('gulp-newer');
var path = require('path');
var pump = require('pump');
var sass = require('gulp-sass');
var tildeImporter = require('node-sass-tilde-importer');
var sourcemaps = require('gulp-sourcemaps');
var buffer = require('vinyl-buffer');
var source = require('vinyl-source-stream');
var tap = require('gulp-tap');
var uglify = require('gulp-uglify');

var paths = {
    images: 'img/**',
    fonts: [
        'fonts/**',
        'node_modules/@fortawesome/fontawesome-free/webfonts/*',
    ],
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
        newer(dest_paths.images),
        gulp.dest(dest_paths.images),
    ], cb);
});

gulp.task('fonts', function(cb) {
    pump([
        gulp.src(paths.fonts),
        newer(dest_paths.fonts),
        gulp.dest(dest_paths.fonts),
    ], cb);
});

gulp.task('css', function(cb) {
    pump([
        gulp.src(paths.css),
        newer({'dest': dest_paths.css, ext: '.css', 'extra': 'scss/**/*.scss'}),
        sourcemaps.init(),
        sass({
            outputStyle: 'compressed',
            importer: tildeImporter
        }).on('error', sass.logError),
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
        isSourceJSNewer(script, (newer) => {
            if(newer) {
                run_browserify(script, false, single_cb);
            } else {
                single_cb();
            }
        });
    });
});

function run_browserify(script, watch, cb) {
    var opts = {debug: true, cache: {}, pluginCache: {}};
    var filename = path.basename(script);

    var b = browserify(script, opts);
    extensionScripts(filename).forEach(function (filename) {
        // Add the file as a stream, because it's the only way I can make
        // it use the package.json file from amara-assets
        b.add(fs.createReadStream(filename));
    });

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
            b.bundle().on('error', log.error.bind(log, 'Browserify Error')),
            source(filename),
            buffer(),
            sourcemaps.init({loadMaps: true}),
            uglify({compress: {drop_debugger: false}}),
            sourcemaps.write('./maps'),
            gulp.dest(dest_paths.js),
        ], cb);
    }
}

function findJSExtensions() {
   var baseDir = process.env.BASE_DIR || '/mnt';
   try {
       var gitmodules = fs.readFileSync(path.join(baseDir, '.gitmodules'));
    } catch(err) {
        return [];
    }

    var re = /path *= *(.*?) *\n/g,
        rv = [],
        m;
    while(m = re.exec(gitmodules)) {
        var globSpec = path.join(baseDir, m[1], 'assets/js-extensions/*.js');
        rv.push.apply(rv, glob.sync(globSpec));
    }
    return rv;
}

function extensionScripts(script) {
    if(path.basename(script) == 'application.js') {
        return findJSExtensions();
    } else {
        return [];
    }
}

function isSourceJSNewer(script, cb) {
    var newerSourceFile = false;
    var sources = [script];
    sources.push.apply(sources, extensionScripts(script));
    var dest = path.join(dest_paths.js, path.basename(script));
    function callCallback() {
        cb(newerSourceFile)
    }
    pump([
        gulp.src(sources),
        newer({dest: dest, extra: path.dirname(script) + '/**'}),
        tap((file) => {newerSourceFile = true;})
    ], callCallback);
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


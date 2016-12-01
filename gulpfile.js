var gulp = require('gulp');
var jade = require('gulp-jade');
var watch = require('gulp-watch');
var sass = require('gulp-sass');
var connect = require('gulp-connect');
var connectRewrite = require('http-rewrite-middleware');
var webpackStream = require('webpack-stream');
var webpack = require('webpack');
var open = require('gulp-open');
var imagemin = require('gulp-imagemin');
var imageminJpegRecompress = require('imagemin-jpeg-recompress');
var del = require('del');
var notify = require('gulp-notify');
var ghPages = require('gulp-gh-pages');
var changed = require('gulp-changed');
var runSequence = require('run-sequence');
var autoprefixer = require('gulp-autoprefixer');
var cssmin = require('gulp-cssmin')

var MISC_FILES = ['./code/CNAME', './code/**/*.mp4', './code/**/*.ogv', './code/**/*.webm', './code/**/*.eot', './code/**/*.svg', './code/**/*.ttf', './code/**/*.woff', './code/**/*.woff2'];
var JADE_FILES = ['./code/**/*.jade', '!./code/lib/**'];
var SASS_FILES = ['./code/**/*.scss', , '!./code/lib/**'];
var FAVICON_BASE = ['./code/favicons'];
var FAVICON_FILES = [(FAVICON_BASE + '/**/*')];
var IMAGE_FILES = ['./code/**/*.png','./code/**/*.jpg','./code/**/*.gif','./code/**/*.jpeg', '!./code/lib/**', '!./code/images/favicons/**/*'];
var APP_JS_FILES = ['./code/scripts/app/**/*.js', '!./code/lib/**'];
var WEBPACKABLE_FILES = './code/scripts/app/**/*.app.js';
var BUILD_DEST = './dist/';
var BUILT_FILES = BUILD_DEST + '**/*';

function logError (error) {
  var errorString = error.toString()
  notify.onError({
    title: 'Build Error',
    message: errorString
  })(error);
  console.log(errorString);
  this.emit('end');
}

var webpackConfig = {
  output: {
    filename: 'main.app.js'
  },
  stats: {
    hash: false,
    version: false,
    timings: false,
    assets: false,
    chunks: true,
    chunkModules: false,
    modules: false,
    children: false,
    cached: false,
    reasons: false,
    source: false,
    chunkOrigins: false
  },
  devtool: 'source-map',
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'react']
        }
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": { "NODE_ENV": JSON.stringify("production") }
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ]
};

function logError (error) {
  var errorString = error.toString()
  notify.onError({
    title: 'Build Error',
    message: errorString
  })(error);
  console.log(errorString);
  this.emit('end');
}

// ---------------------------------
// --------- BUILD TASKS -----------
// ---------------------------------
gulp.task('clean', function(callback) {
  return del(BUILT_FILES, callback);
});

gulp.task('favicons', function() {
  return gulp.src(FAVICON_FILES, {cwd: FAVICON_BASE})
    .pipe(gulp.dest(BUILD_DEST))
    .on('error', logError)
    .pipe(connect.reload());
});

gulp.task('misc', function() {
  return gulp.src(MISC_FILES)
    .pipe(changed(BUILD_DEST))
    .pipe(gulp.dest(BUILD_DEST))
    .on('error', logError)
    .pipe(connect.reload());
});

gulp.task('templates', function() {
  return gulp.src(JADE_FILES)
    .pipe(jade({
      pretty: true
    }))
    .on('error', logError)
    .pipe(gulp.dest(BUILD_DEST))
    .pipe(connect.reload());
});

gulp.task('styles', function() {
  return gulp.src(SASS_FILES)
    .pipe(sass())
    .on('error', logError)
    .pipe(autoprefixer({
      browsers: ['> 1%', 'last 2 versions', 'IE 9']
    }))
    .on('error', logError)
    .pipe(cssmin())
    .on('error', logError)
    .pipe(gulp.dest(BUILD_DEST))
    .pipe(connect.reload());
});

gulp.task('images', function() {
  return gulp.src(IMAGE_FILES)
    .pipe(changed(BUILD_DEST))
    .pipe(imagemin([
      imageminJpegRecompress()
    ]))
    .on('error', logError)
    .pipe(gulp.dest(BUILD_DEST))
    .pipe(connect.reload());
});

gulp.task("app_scripts", function() {
  return gulp.src(WEBPACKABLE_FILES)
    .pipe(webpackStream(webpackConfig))
    .on('error', logError)
    .pipe(gulp.dest(BUILD_DEST+'scripts/app/'));
});

gulp.task("app_scripts:watched", function() {
  webpackConfig.watch = true;
  return gulp.src(WEBPACKABLE_FILES)
    .pipe(webpackStream(webpackConfig))
    .on('error', logError)
    .pipe(gulp.dest(BUILD_DEST+'scripts/app/'))
    .pipe(connect.reload());
})

// ---------------------------------
// --------- WATCH TASKS -----------
// ---------------------------------
gulp.task('watch', function () {

  watch(FAVICON_FILES, function() {
    gulp.start('favicons');
  });

  watch(MISC_FILES, function() {
    gulp.start('misc');
  })

  watch(JADE_FILES, function() {
    gulp.start('templates');
  });

  watch(SASS_FILES, function() {
    gulp.start('styles');
  });

  watch(IMAGE_FILES, function() {
    gulp.start('images');
  });

});

// ----------------------------------
// --------- SERVER TASKS -----------
// ----------------------------------
gulp.task('connect', function() {

  var middleware = connectRewrite.getMiddleware([
    {from: '^([^.]+[^/])$', to: '$1.html'}
  ]);

  return connect.server({
    root: 'dist',
    livereload: true,
    port: 8081,
    middleware: function(connect, options) {
      return [middleware];
    }
  });
});

gulp.task('open', function(){
  return gulp.src('./dist/index.html')
  .pipe(open('', {
    url: 'http://localhost:8081',
    app: 'google chrome'
  }));
});

// ----------------------------------
// --------- DEPLOY TASKS -----------
// ----------------------------------
gulp.task('deploy', function() {
  return gulp.src(BUILT_FILES)
    .pipe(ghPages())
    .on('error', logError);
});

// ----------------------------------
// --------- COMPOSITE TASKS --------
// ----------------------------------
gulp.task('build', function(cb) {
  return runSequence('clean', ['misc', 'favicons', 'templates', 'styles', 'images', 'app_scripts'], cb)
});
gulp.task('start', function(cb) {
  return runSequence('clean', ['misc', 'favicons', 'templates', 'styles', 'images', 'app_scripts'], 'connect', ['app_scripts:watched', 'watch', 'open'], cb);
});

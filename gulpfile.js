const gulp = require('gulp')
const gutil = require('gulp-util')
const webpackStream = require('webpack-stream')
const pug = require('gulp-pug')
const watch = require('gulp-watch')
const sass = require('gulp-sass')
const connect = require('gulp-connect');
const connectRewrite = require('http-rewrite-middleware')
const debounce = require('gulp-debounce');
const uglify = require('gulp-uglify')
const open = require('gulp-open')
const del = require('del')
const notify = require('gulp-notify')
const ghPages = require('gulp-gh-pages')
const changed = require('gulp-changed')
const runSequence = require('run-sequence')
const autoprefixer = require('gulp-autoprefixer')
const cssmin = require('gulp-cssmin')
const webpack = require('webpack')
const imagemin = require('gulp-imagemin')
const imageminJpegRecompress = require('imagemin-jpeg-recompress')

const MISC_FILES = ['./code/CNAME', './code/**/*.mp4', './code/**/*.ogv', './code/**/*.webm', './code/**/*.eot', './code/**/*.ttf', './code/**/*.woff', './code/**/*.woff2']
const PUG_FILES = ['./code/**/*.pug', './code/**/*.jade']
const SASS_FILES = ['./code/**/*.scss']
const SASS_INCLUDE_PATHS = [
  'node_modules/normalize-scss/sass',
  'node_modules/susy/sass'
]
const FAVICON_BASE = ['./code/favicons']
const FAVICON_FILES = [(FAVICON_BASE + '/**/*')]
const IMAGE_FILES = ['./code/**/*.png','./code/**/*.jpg','./code/**/*.gif','./code/**/*.jpeg', './code/**/*.svg', '!./code/images/favicons/**/*']
const WEBPACKABLE_FILES = './code/scripts/index.js'
const BUILD_SRC = './code/'
const BUILD_DEST = './dist/'
const BUILT_FILES = BUILD_DEST + '**/*'

const webpackConfig = {
  output: {
    filename: 'index.js',
    devtoolModuleFilenameTemplate: '[resource-path]'
  },
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
  devtool: 'source-map',
  devServer: {
    stats: {
      colors: true,
      chunks: false
    }
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
  ],
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
  }
}

const logError = function(error) {
  var errorString = error.toString()
  notify.onError({
    title: 'Build Error',
    message: errorString
  })(error)
  console.log(errorString)
  this.emit('end')
}

// ---------------------------------
// --------- BUILD TASKS -----------
// ---------------------------------
gulp.task('clean', (callback) => {
  return del(BUILT_FILES, callback)
})

gulp.task('favicons', () => {
  return gulp.src(FAVICON_FILES, {cwd: FAVICON_BASE})
    .pipe(gulp.dest(BUILD_DEST))
    .on('error', logError)
})

gulp.task('misc', () => {
  return gulp.src(MISC_FILES)
    .pipe(changed(BUILD_DEST))
    .pipe(gulp.dest(BUILD_DEST))
    .on('error', logError)
})

gulp.task('templates', () => {
  return gulp.src(PUG_FILES)
    .pipe(pug({
      pretty: true
    }))
    .on('error', logError)
    .pipe(gulp.dest(BUILD_DEST))
})

gulp.task('styles', () => {
  return gulp.src(SASS_FILES)
    .pipe(sass({ includePaths: SASS_INCLUDE_PATHS }))
    .on('error', logError)
    .pipe(autoprefixer({
      browsers: ['> 1%', 'last 2 versions', 'IE 9']
    }))
    .on('error', logError)
    .pipe(cssmin())
    .on('error', logError)
    .pipe(gulp.dest(BUILD_DEST))
})

gulp.task('images', () => {
  return gulp.src(IMAGE_FILES)
    .pipe(changed(BUILD_DEST))
    .pipe(imagemin([
      imageminJpegRecompress({quality: 'veryhigh'})
    ]))
    .on('error', logError)
    .pipe(gulp.dest(BUILD_DEST))
})

gulp.task("app_scripts", () => {
  return gulp.src(WEBPACKABLE_FILES)
    .pipe(webpackStream(webpackConfig))
    .on('error', logError)
    .pipe(gulp.dest(BUILD_DEST+'scripts/'))
})

gulp.task('reload', () => {
  return gulp.src(BUILT_FILES)
    .pipe(debounce({ wait: 1000 })) // Avoids double/triple page reloads
    .pipe(connect.reload())
})

// ---------------------------------
// --------- WATCH TASKS -----------
// ---------------------------------
gulp.task('watch', () => {
  watch(FAVICON_FILES, () => gulp.start('favicons'))
  watch(MISC_FILES, () => gulp.start('misc'))
  watch(SASS_FILES, () => gulp.start('styles'))
  watch(IMAGE_FILES, () => gulp.start('images'))
  watch(PUG_FILES, () => gulp.start('templates'))

  webpackConfig.watch = true
  gulp.src(WEBPACKABLE_FILES)
    .pipe(webpackStream(webpackConfig))
    .on('error', logError)
    .pipe(gulp.dest(BUILD_DEST+'scripts/'))

  watch(BUILT_FILES, () => gulp.start('reload'))
})

// ----------------------------------
// --------- SERVER TASKS -----------
// ----------------------------------
gulp.task('server', () => {
  const middleware = connectRewrite.getMiddleware([
    {from: '^([^.]+[^/])$', to: '$1.html'}
  ])

  connect.server({
    root: 'dist',
    livereload: true,
    middleware: (connect, options) => {
      return [middleware]
    }
  })

  return gulp.src('./dist/index.html')
    .pipe(open('', {
      url: 'http://localhost:8080',
      app: 'google chrome'
    }))
})

// ----------------------------------
// --------- DEPLOY TASKS -----------
// ----------------------------------
gulp.task('deploy', () => {
  return gulp.src(BUILT_FILES)
    .pipe(ghPages({
      remoteUrl: 'git@github.com:weareleaf/howdy.github.io.git',
      force: true,
      branch: 'master'
    }))
    .on('error', logError)
})
// ----------------------------------
// --------- COMPOSITE TASKS --------
// ----------------------------------
gulp.task('build', (cb) => {
  return runSequence('clean', ['misc', 'favicons', 'templates', 'styles', 'images', 'app_scripts'], cb)
})
gulp.task('start', (cb) => {
  return runSequence('clean', ['misc', 'favicons', 'templates', 'styles', 'images'], 'watch', 'server', cb)
})

'use strict';

const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync');
const combineMq = require('gulp-combine-mq');
const concat = require('gulp-concat');
const config = require('./config.json');
const del = require('del');
const gulp = require('gulp');
const htmlPartial = require('gulp-html-partial');
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify-es').default;

// > Dev tasks
// >> Delete Public folder
gulp.task('clean', del.bind(null, ['public']));

// >> Process HTML files
gulp.task('html', function (done) {
  gulp
    .src(config.html.src)
    .pipe(
      plumber({ errorHandler: notify.onError('Error: <%= error.message %>') })
    )
    .pipe(
      htmlPartial({
        basePath: config.html.partials
      })
    )
    .pipe(gulp.dest(config.html.dest));
  done();
});

// >> Process SCSS files (extended + sourcemaps +  autoprefixer)
gulp.task('styles', function (done) {
  gulp
    .src(config.scss.src)
    .pipe(sourcemaps.init())
    .pipe(
      plumber({ errorHandler: notify.onError('Error: <%= error.message %>') })
    )
    .pipe(
      sass({
        outputStyle: 'extended'
      })
    )
    .pipe(
      combineMq({
        beautify: true
      })
    )
    .pipe(
      autoprefixer({
        browsers: ['last 2 versions', 'ie >= 10'],
        cascade: false
      })
    )
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(config.scss.dest))
    .pipe(browserSync.reload({ stream: true }));
  done();
});

// >> Concatenate JS files with sourcemaps
gulp.task('scripts', function (done) {
  gulp
    .src(config.js.src)
    .pipe(sourcemaps.init())
    .pipe(
      plumber({ errorHandler: notify.onError('Error: <%= error.message %>') })
    )
    .pipe(concat('main.js'))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(config.js.dest))
    .pipe(browserSync.reload({ stream: true }));
  done();
});

// >> Copy image files
gulp.task('images', function (done) {
  gulp
    .src(config.images.src)
    .pipe(
      plumber({ errorHandler: notify.onError('Error: <%= error.message %>') })
    )
    .pipe(gulp.dest(config.images.dest));
  done();
});


// >> Copy api files
gulp.task('api', function (done) {
  gulp.src(config.api.src).pipe(gulp.dest(config.api.dest));
  done();
});

// >> Copy icon files
gulp.task('icons', function (done) {
  gulp
    .src(config.icons.src)
    .pipe(
      plumber({ errorHandler: notify.onError('Error: <%= error.message %>') })
    )
    .pipe(gulp.dest(config.icons.dest));
  done();
});
// >> Copy sound files
gulp.task('sounds', function (done) {
  gulp
    .src(config.sounds.src)
    .pipe(
      plumber({ errorHandler: notify.onError('Error: <%= error.message %>') })
    )
    .pipe(gulp.dest(config.sounds.dest));
  done();
});
// >> Copy font files
gulp.task('fonts', function (done) {
  gulp
    .src(config.fonts.src)
    .pipe(
      plumber({ errorHandler: notify.onError('Error: <%= error.message %>') })
    )
    .pipe(gulp.dest(config.fonts.dest));
  done();
});
// > Production Tasks
// > Delete Public folder
gulp.task('clean-dist', del.bind(null, ['docs']));

// >> Process HTML files
gulp.task('html-dist', function (done) {
  gulp
    .src(config.html.src)
    .pipe(
      plumber({ errorHandler: notify.onError('Error: <%= error.message %>') })
    )
    .pipe(
      htmlPartial({
        basePath: config.html.partials
      })
    )
    .pipe(gulp.dest(config.html.dist));
  done();
});

// >> Process SCSS files (compressed + autoprefixer)
gulp.task('styles-dist', function (done) {
  gulp
    .src(config.scss.src)
    .pipe(
      plumber({ errorHandler: notify.onError('Error: <%= error.message %>') })
    )
    .pipe(
      sass({
        outputStyle: 'compressed'
      })
    )
    .pipe(
      combineMq({
        beautify: false
      })
    )
    .pipe(
      autoprefixer({
        browsers: ['last 2 versions', 'ie >= 10'],
        cascade: false
      })
    )
    .pipe(gulp.dest(config.scss.dist));
  done();
});

// >> Concatenate and minify JS files w/o sourcemaps
gulp.task('scripts-dist', function (done) {
  gulp
    .src(config.js.src)
    .pipe(
      plumber({ errorHandler: notify.onError('Error: <%= error.message %>') })
    )
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(gulp.dest(config.js.dist));
  done();
});

// >> Copy image files
gulp.task('api-dist', function (done) {
  gulp.src(config.api.src).pipe(gulp.dest(config.api.dist));
  done();
});

// >> Copy image files
gulp.task('images-dist', function (done) {
  gulp
    .src(config.images.src)
    .pipe(
      plumber({ errorHandler: notify.onError('Error: <%= error.message %>') })
    )
    .pipe(gulp.dest(config.images.dist));
  done();
});

// >> Copy icon files
gulp.task('icons-dist', function (done) {
  gulp
    .src(config.icons.src)
    .pipe(
      plumber({ errorHandler: notify.onError('Error: <%= error.message %>') })
    )
    .pipe(gulp.dest(config.icons.dist));
  done();
});
// >> Copy sound files
gulp.task('sounds-dist', function (done) {
  gulp
    .src(config.sounds.src)
    .pipe(
      plumber({ errorHandler: notify.onError('Error: <%= error.message %>') })
    )
    .pipe(gulp.dest(config.sounds.dist));
  done();
});
// >> Copy font files
gulp.task('fonts-dist', function (done) {
  gulp
    .src(config.fonts.src)
    .pipe(
      plumber({ errorHandler: notify.onError('Error: <%= error.message %>') })
    )
    .pipe(gulp.dest(config.fonts.dist));
  done();
});
// > Watchers + BrowserSync server
gulp.task(
  'default',
  gulp.series(
    ['clean', 'html', 'styles', 'scripts', 'images', 'api', 'icons', 'fonts', 'sounds', 'images'],
    function (done) {
      browserSync.init({
        server: {
          baseDir: './public/'
        }
      });
      gulp.watch(config.watch.html, gulp.series(['html', 'bs-reload']));
      gulp.watch(config.images.src, gulp.series(['images', 'bs-reload']));
      gulp.watch(config.sounds.src, gulp.series(['sounds', 'bs-reload']));
      gulp.watch(config.fonts.src, gulp.series(['fonts', 'bs-reload']));
      gulp.watch(config.api.src, gulp.series(['api', 'bs-reload']));
      gulp.watch(config.icons.src, gulp.series(['icons', 'bs-reload']));
      gulp.watch(config.scss.src, gulp.series('styles'));
      gulp.watch(config.js.src, gulp.series(['scripts', 'bs-reload']));
      done();
    }
  )
);

// > Build a production-ready version of your proyect
gulp.task(
  'docs',
  gulp.series(
    [
      'clean-dist',
      'html-dist',
      'styles-dist',
      'scripts-dist',
      'images-dist',
      'api-dist',
      'icons-dist',
      'fonts-dist',
      'sounds-dist'
    ],
    function (done) {
      // eslint-disable-next-line no-console
      console.log('🦄 Build OK!');
      done();
    }
  )
);

// > Recarga las ventanas del navegador
gulp.task('bs-reload', function (done) {
  browserSync.reload();
  done();
});

const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const terser = require('gulp-terser');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create();

function styles() {
  return gulp.src('scss/main.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('css'))
    .pipe(browserSync.stream());
}

function stylesBuild() {
  return gulp.src('scss/main.scss')
    .pipe(sass({ style: 'compressed' }).on('error', sass.logError))
    .pipe(gulp.dest('dist/css'));
}

function scripts() {
  return gulp.src('js/src/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(concat('main.min.js'))
    .pipe(terser())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('js'));
}

function scriptsBuild() {
  return gulp.src('js/src/**/*.js')
    .pipe(concat('main.min.js'))
    .pipe(terser())
    .pipe(gulp.dest('dist/js'));
}

function copyFiles() {
  return gulp.src(['index.html', 'fonts/**', 'img/**'], { base: '.', encoding: false })
    .pipe(gulp.dest('dist', { encoding: false }));
}

function serve() {
  browserSync.init({
    server: { baseDir: './' },
    notify: false,
  });

  gulp.watch('scss/**/*.scss', styles);
  gulp.watch('js/src/**/*.js', scripts).on('change', browserSync.reload);
  gulp.watch('*.html').on('change', browserSync.reload);
}

exports.styles = styles;
exports.scripts = scripts;
exports.watch = serve;
exports.build = gulp.series(gulp.parallel(stylesBuild, scriptsBuild), copyFiles);
exports.default = gulp.series(gulp.parallel(styles, scripts), serve);
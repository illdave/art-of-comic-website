"use strict";

// plugins
const autoprefixer = require("autoprefixer");
const browsersync = require("browser-sync").create();
const cp = require("child_process");
const cssnano = require("cssnano");
const del = require("del");
const gulp = require("gulp");
const imagemin = require("gulp-imagemin");
const newer = require("gulp-newer");
const plumber = require("gulp-plumber");
const postcss = require("gulp-postcss");
const rename = require("gulp-rename");
const { src, dest } = require('gulp');
const concat = require('gulp-concat');
const sass = require('gulp-sass')(require('sass'));


// browser sync
function browserSync(done) {
  browsersync.init({
    server: {
      baseDir: "../Web Root/"
    },
    port: 3000
  });
  done();
}

// browser sync reload
function browserSyncReload(done) {
  browsersync.reload();
  done();
}

// images
function images() {
  return gulp
    .src("../Web Root/assets/img/**/*")
    .pipe(newer("../Web Root/assets/img"))
    .pipe(
      imagemin([
        imagemin.gifsicle({ interlaced: true }),
        imagemin.mozjpeg({ progressive: true }),
        imagemin.optipng({ optimizationLevel: 5 }),
        imagemin.svgo({
          plugins: [
            {
              removeViewBox: false,
              collapseGroups: true
            }
          ]
        })
      ])
    )
    .pipe(gulp.dest("../Web Root/assets/img"));
}

// css
function css() {
	return gulp
	.src("scss/**/*.scss")
	.pipe(plumber())
	.pipe(sass({ outputStyle: 'expanded'}))
    .pipe(sass().on('error',sass.logError))
	.pipe(gulp.dest("../Web Root/assets/themes/art-of-comic/"))
	.pipe(browsersync.stream());
}

// watch files
function watchFiles() {
  gulp.watch("scss/**/*.scss", css);
  gulp.watch(
    [
      "../Web Root/_about/**/*",
      "../Web Root/_blog/**/*",
      "../Web Root/_schedule/**/*",
      "../Web Root/_studio/**/*",
      "../Web Root/_templates/**/*"
    ],
  );
  
gulp.watch('./*.html').on('change',browserSync.reload);
 gulp.watch('./js/**/*.js').on('change', browserSync.reload);
  
  gulp.watch("../Web Root/assets/img/**/*", images);
}

// define complex tasks
const build = gulp.series(gulp.parallel(css, images));
const watch = gulp.parallel(watchFiles, browserSync);

// export tasks
exports.images = images;
exports.css = css;
exports.build = build;
exports.watch = watch;
exports.default = build;





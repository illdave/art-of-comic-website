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
const { src, dest } = require("gulp");
const concat = require("gulp-concat");
const sass = require("gulp-sass")(require("sass"));
const sourcemaps = require("gulp-sourcemaps");
const cleanCSS = require('gulp-clean-css');

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

// CSS 
function css() {
	return gulp
	.src("scss/**/*.scss")
	.pipe(sourcemaps.init()) 
	.pipe(plumber())
	.pipe(sass({ outputStyle: 'expanded'}))
	.pipe(sourcemaps.write())
	.pipe(gulp.dest("../Web Root/assets/themes/art-of-comic/"))
	.pipe(browsersync.stream());
}

// minify css (no rename)
function minifycss() {
	return gulp
	.src("../Web Root/assets/themes/art-of-comic/*.css")
    .pipe(sourcemaps.init())
	.pipe(cleanCSS())
    .pipe(sourcemaps.write())
	.pipe(gulp.dest("../Web Root/assets/themes/art-of-comic/"));
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
  gulp.watch("../Web Root/assets/img/**/*", images);
}

// define complex tasks
const watch = gulp.parallel(watchFiles, browserSync);
const build = gulp.series(gulp.parallel(css, images));


// export tasks
exports.images = images;
exports.css = css;
exports.minifycss = minifycss;
exports.build = build;
exports.watch = watch;
exports.default = build;


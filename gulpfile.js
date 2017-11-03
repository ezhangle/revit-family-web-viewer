var gulp = require('gulp');
var bro = require('gulp-bro');
var scss = require('gulp-scss');
var cleanCSS = require('gulp-clean-css');
var rename = require('gulp-rename');
var ts = require('gulp-typescript');
var tsProject = ts.createProject('tsconfig.json');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('ts-scripts', function() {
    var tsResult = gulp.src("./src/**/*.ts")
        .pipe(sourcemaps.init({largeFile: true, loadMaps: true}))
        .pipe(tsProject());
 
    return tsResult.js
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./dist/js'));
});

gulp.task('browserify', [ 'ts-scripts' ], function() {
    gulp.src('./dist/js/index.js')
    .pipe(sourcemaps.init({largeFile: true, loadMaps: true}))
    .pipe(bro())
    .pipe(rename('main.js'))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist/js'));
});

gulp.task('scss', function () {
    gulp.src('./src/scss/**/*.scss')
        .pipe(sourcemaps.init({largeFile: true, loadMaps: false}))
        .pipe(scss({
            // "bundleExec": true
        }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./dist/css'));
});

gulp.task('css-minify', [ 'scss' ], function () {

    gulp.src([
            './dist/css/**/*.css',
            '!./dist/css/**/*.min.css'
        ])
        .pipe(sourcemaps.init({largeFile: true, loadMaps: false}))
        .pipe(cleanCSS())
        .pipe(rename({
            suffix: ".min",
        }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./dist/css'));
});

gulp.task('watch', [ 'browserify', 'css-minify' ], function() {
    gulp.watch('./src/*.ts', [ 'browserify' ]);
    gulp.watch('./src/*.scss', [ 'css-minify' ]);
});

gulp.task('default', [ 'browserify', 'css-minify' ], function() {
    // Just build ts-scripts and run browserify
});

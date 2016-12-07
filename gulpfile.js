'use strict';

var gulp = require('gulp');
var rimraf = require('gulp-rimraf');
var $ = require('gulp-load-plugins')();
var isMac = /darwin/.test(process.platform);
var sass = require('gulp-sass');
var cssnano = require('gulp-cssnano');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');

var sassOptions = {
    errLogToConsole: true,
    outputStyle: 'expanded'
};
var autoprefixerOptions = {
    browsers: ['last 2 versions', 'safari 5', 'ie 8', 'ie 9', '> 5%', 'Firefox ESR']
};
var cssnanoOptions = {
    zindex: false
};

gulp.task('styles', function () {
    return gulp.src('./assets/sass/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass(sassOptions).on('error', sass.logError))
        .pipe(autoprefixer(autoprefixerOptions))
        .pipe(cssnano(cssnanoOptions))
        .pipe(sourcemaps.write('maps/'))
        .pipe(gulp.dest('./public/css'))
        .pipe($.if(isMac, $.notify({
            message: 'Sass transfor to css complete'
        })));
});

gulp.task('bundle-vendor', function() {
    return gulp.src('./bundle-vendor.config.js')
        .pipe($.bundleAssets())
        .pipe(gulp.dest('./public/js'));
});

gulp.task('scripts', function(){
    return gulp.src('./assets/js/**/*.js')
        .pipe($.eslint())
        .pipe($.eslint.format())
        .pipe(gulp.dest('./public/js'))
        .pipe($.uglifyjs({
            outSourceMap: 'maps/app.js.map'
        }))
        .pipe(gulp.dest('./public/js'))
        .pipe($.if(isMac, $.notify({
            message: 'JavaScript task complete'
        })));
});

gulp.task('images', function(){
    return gulp.src('./assets/images/**/*.*')
        .pipe($.cache($.imagemin({
            interlaced: true,
            multipass: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [require('imagemin-pngquant')()]
        })))
        .pipe(gulp.dest('public/img'));
});

gulp.task('clean', function(){
    return gulp.src([ 'public/css', 'public/js'],{ read: false })
        .pipe(rimraf());
});

gulp.task('watch', function(){
    // watch sass files change
    gulp.watch('./assets/sass/**/*.scss', ['styles']);
    // watch javascript files change
    gulp.watch('./assets/js/**/*.js', ['scripts']);
    // watch images files change
    gulp.watch('./assets/images/**/*.*', ['images']);
});

gulp.task('default', ['clean'], function(){
    gulp.start('images', 'bundle-vendor', 'styles', 'scripts');
});
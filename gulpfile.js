'use strict';

var gulp = require('gulp');
var rimraf = require('gulp-rimraf');
var $ = require('gulp-load-plugins')();
var isMac = /darwin/.test(process.platform);
var sass = require('gulp-sass');
var cssnano = require('gulp-cssnano');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');

var environments = require('gulp-environments');
var development = environments.development;
var production = environments.production;

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

var assets_path = './assets/';
var dest_path = './public/';

/* EJS檔轉HTML */
gulp.task('html', function() {
    return gulp.src('./templates/*.ejs')
        .pipe($.ejs({},{ext:'.html'}))
        .pipe(gulp.dest('./views/'));
});

/* Sass 轉 main.css */
gulp.task('styles', function () {
    return gulp.src(assets_path + 'sass/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass(sassOptions).on('error', sass.logError))
        .pipe(autoprefixer(autoprefixerOptions))
        .pipe(gulp.dest(assets_path + 'css'))
        .pipe(production(cssnano(cssnanoOptions)))
        .pipe(sourcemaps.write('maps/'))
        .pipe(gulp.dest(dest_path + 'css'))
        .pipe($.if(isMac, $.notify({
            message: 'Sass transfor to css complete'
        })));
});

/* 打包第三方JS套件 */
gulp.task('bundle-vendor', function() {
    return gulp.src('./bundle-vendor.config.js')
        .pipe($.bundleAssets())
        .pipe(gulp.dest(dest_path + 'js'));
});
/* 連接,壓縮js檔案 */
gulp.task('scripts', function(){
    return gulp.src(assets_path + 'js/**/*.js')
        .pipe($.babel({ presets: ['es2015'] }))
        .pipe($.eslint())
        .pipe($.eslint.format())
        .pipe($.concat('app.js'))
        .pipe(gulp.dest(dest_path + 'js'))
        .pipe(production($.uglifyjs({
            outSourceMap: 'maps/app.js.map'
        })))
        .pipe(gulp.dest(dest_path + 'js'))
        .pipe($.if(isMac, $.notify({
            message: 'JavaScript task complete'
        })));
});

/* 壓縮png,jpg等圖片 */
gulp.task('images', function(){
    return gulp.src(assets_path + 'images/**/*.*')
        .pipe($.cache($.imagemin({
            interlaced: true,
            multipass: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [require('imagemin-pngquant')()]
        })))
        .pipe(gulp.dest(dest_path + 'img'));
});

gulp.task('clean', function(){
    return gulp.src([ dest_path + 'css', dest_path + 'js', './views/*.html'],{ read: false })
        .pipe(rimraf());
});

gulp.task('watch', function(){
    // watch sass files change
    gulp.watch(assets_path + 'sass/**/*.scss', ['styles']);
    // watch javascript files change
    gulp.watch(assets_path + 'js/**/*.js', ['scripts']);
    // watch images files change
    gulp.watch(assets_path + 'images/**/*.*', ['images']);
    // watch ejs template files changes
    gulp.watch('./templates/**/*.ejs', ['html']);
});

gulp.task('default', ['clean'], function(){
    gulp.start('images', 'bundle-vendor', 'styles', 'scripts', 'html');
});
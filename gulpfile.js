'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var isMac = /darwin/.test(process.platform);

var environments = require('gulp-environments');
// var development = environments.development;
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

var PATH = {
    EJS: {
        src: [ './templates/**/*.ejs', '!./templates/**/_*.ejs'],
        dest: './views/'
    },
    SASS: {
        src: './assets/sass/**/*.scss',
        tmp: './assets/css/',
        dest: './public/css/'
    },
    JS: {
        src: './assets/js/**/*.js',
        dest: './public/js/'
    },
    IMAGE: {
        src: './assets/img/**/*.*',
        dest: './public/img/'
    },
    CLEAN: ['./public/js', './public/css', './views/*.html']
};

/* EJS檔轉HTML */
gulp.task('html', function() {
    gulp.src(PATH.EJS.src)
        .pipe($.plumber())
        .pipe($.frontMatter({
            property: 'data',
            remove: true
        }))
        .pipe($.layout(function(file) {
            return file.data;
        }))
        .pipe($.ejs({},{ext:'.html'}))
        .pipe(gulp.dest(PATH.EJS.dest))
        .pipe($.if(isMac, $.notify({
            message: 'EJS transfor to HTML complete'
        })));
});

/* Sass 轉 main.css */
gulp.task('styles', function () {
    return gulp.src(PATH.SASS.src)
        .pipe($.sourcemaps.init())
        .pipe($.sass(sassOptions).on('error', $.sass.logError))
        .pipe($.autoprefixer(autoprefixerOptions))
        .pipe(gulp.dest(PATH.SASS.tmp))
        .pipe(production($.cssnano(cssnanoOptions)))
        .pipe($.sourcemaps.write('maps/'))
        .pipe(gulp.dest(PATH.SASS.dest))
        .pipe($.if(isMac, $.notify({
            message: 'Sass transfor to css complete'
        })));
});

/* 打包第三方JS套件 */
gulp.task('bundle-vendor', function() {
    return gulp.src('./bundle-vendor.config.js')
        .pipe($.bundleAssets())
        .pipe(gulp.dest(PATH.JS.dest));
});
/* 連接,壓縮js檔案 */
gulp.task('scripts', function(){
    return gulp.src(PATH.JS.src)
        .pipe($.babel({ presets: ['es2015'] }))
        .pipe($.eslint())
        .pipe($.eslint.format())
        .pipe($.concat('app.js'))
        .pipe(gulp.dest(PATH.JS.dest))
        .pipe(production($.uglifyjs({
            outSourceMap: 'maps/app.js.map'
        })))
        .pipe(gulp.dest(PATH.JS.dest))
        .pipe($.if(isMac, $.notify({
            message: 'JavaScript task complete'
        })));
});

/* 壓縮png,jpg等圖片 */
gulp.task('images', function(){
    return gulp.src(PATH.IMAGE.src)
        .pipe($.cache($.imagemin({
            interlaced: true,
            multipass: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [require('imagemin-pngquant')()]
        })))
        .pipe(gulp.dest(PATH.IMAGE.dest));
});

gulp.task('clean', function(){
    return gulp.src(PATH.CLEAN, { read: false })
        .pipe($.rimraf());
});

gulp.task('watch', function(){
    // watch sass files change
    gulp.watch(PATH.SASS.src, ['styles']);
    // watch javascript files change
    gulp.watch(PATH.JS.src, ['scripts']);
    // watch images files change
    gulp.watch(PATH.IMAGE.src, ['images']);
    // watch ejs template files changes
    gulp.watch(PATH.EJS.src, ['html']);
});

gulp.task('default', ['clean'], function(){
    gulp.start('images', 'bundle-vendor', 'styles', 'scripts', 'html');
});
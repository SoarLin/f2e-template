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
        tmp: './tmp/',
        dest: './public/'
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
        src: './assets/images/**/*.*',
        dest: './public/img/'
    },
    FONT: {
        src: './assets/bower/**/fonts/**/*',
        dest: './public/fonts/'
    },
    RELEASE: {
        base: './dist/',
        js: './dist/js/',
        css: './dist/css/',
        img: './dist/img/',
        font: './dist/fonts/'
    },
    CLEAN: ['./public/js', './public/css',
        './public/img', './public/fonts',
        './tmp/*.html', './public/*.html', './dist/*']
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
        .pipe(gulp.dest(PATH.EJS.tmp))
        .pipe($.if(isMac, $.notify({
            message: 'EJS transfor to HTML complete'
        })));
});

gulp.task('htmlmin', ['bundle-vendor', 'fonts', 'images', 'styles', 'scripts'], function() {
    return gulp.src('tmp/*.html')
        // .pipe($.useref({searchPath: ['.tmp', '.', './piblic/js']}))
        .pipe($.useref({searchPath: ['.tmp', '.']}))
        .pipe($.if('*.js', $.uglify()))
        .pipe($.if('*.css', $.cssnano({zindex: false, safe: true, autoprefixer: false})))
        // .pipe($.if('*.html', $.htmlmin({collapseWhitespace: true})))
        .pipe(gulp.dest(PATH.RELEASE.base));
});

/* Sass 轉 main.css */
gulp.task('styles', function () {
    return gulp.src(PATH.SASS.src)
        .pipe($.plumber())
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
        .pipe($.plumber())
        .pipe($.bundleAssets())
        .pipe(gulp.dest(PATH.JS.dest));
});
/* 連接,壓縮js檔案 */
gulp.task('scripts', function(){
    return gulp.src(PATH.JS.src)
        .pipe($.plumber())
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
        .pipe($.plumber())
        .pipe($.cache($.imagemin({
            interlaced: true,
            multipass: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [require('imagemin-pngquant')()]
        })))
        .pipe(gulp.dest(PATH.IMAGE.dest))
        .pipe(gulp.dest(PATH.RELEASE.img));
});

gulp.task('fonts', function() {
    return gulp.src(['./assets/bower/**/fonts/**/*'])
        .pipe($.filter('**/*.{eot,svg,ttf,woff,woff2}'))
        .pipe($.flatten())
        .pipe(gulp.dest(PATH.FONT.dest))
        .pipe(gulp.dest(PATH.RELEASE.font));
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
    // watch font files change
    gulp.watch(PATH.FONT.src, ['fonts']);
    // watch ejs template files changes
    gulp.watch(PATH.EJS.src, ['html']);
});

gulp.task('default', ['clean'], function(){
    // gulp.start('images', 'fonts', 'bundle-vendor', 'styles', 'scripts', 'html');
    gulp.start('html', 'htmlmin');
});
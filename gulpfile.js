const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const browserSync = require('browser-sync').create();
const del = require('del');
const wiredep = require('wiredep').stream;
const runSequence = require('run-sequence');

const connect = require('gulp-connect');

const $ = gulpLoadPlugins();
const reload = browserSync.reload;

var dev = false;

gulp.task('styles', () => {
    return gulp.src('public/styles/*.scss')
        .pipe($.plumber())
        .pipe($.if(dev, $.sourcemaps.init()))
        .pipe($.sass.sync({
            outputStyle: 'expanded',
            precision: 10,
            includePaths: ['.']
        }).on('error', $.sass.logError))
        .pipe($.autoprefixer({browsers: ['> 1%', 'last 2 versions', 'Firefox ESR']}))
        .pipe($.if(dev, $.sourcemaps.write()))
        .pipe(gulp.dest('public/dist/styles'))
        .pipe(reload({stream: true}));
});
gulp.task('stylesmin', () => {
    return gulp.src('public/styles/*.scss')
        .pipe($.plumber())
        .pipe($.if(dev, $.sourcemaps.init()))
        .pipe($.sass.sync({
            outputStyle: 'compressed',
            precision: 10,
            includePaths: ['.']
        }).on('error', $.sass.logError))
        .pipe($.autoprefixer({browsers: ['> 1%', 'last 2 versions', 'Firefox ESR']}))
        .pipe($.if(dev, $.sourcemaps.write()))
        .pipe(gulp.dest('public/dist/styles'))
        .pipe(reload({stream: true}));
});

gulp.task('scripts', () => {
    return gulp.src('public/scripts/**/*.scripts')
        .pipe($.plumber())
        .pipe($.if(dev, $.sourcemaps.init()))
        // .pipe($.babel())
        .pipe($.if(dev, $.sourcemaps.write('.')))
        // .pipe($.uglify({compress: {drop_console: true}}))
        .pipe(gulp.dest('public/dist/scripts'))
        .pipe(reload({stream: true}));
});
gulp.task('scriptsmin', () => {
    return gulp.src('public/scripts/**/*.scripts')
        .pipe($.plumber())
        // .pipe($.if(dev, $.sourcemaps.init()))
        // .pipe($.babel())
        // .pipe($.if(dev, $.sourcemaps.write('.')))
        .pipe($.uglify({compress: {drop_console: true}}))
        .pipe(gulp.dest('public/dist/scripts'))
        .pipe(reload({stream: true}));
});

gulp.task('fonts', () => {
    return gulp.src(require('main-bower-files')('**/*.{eot,svg,ttf,woff,woff2}', function (err) {})
        .concat('public/fonts/**/*'))
        .pipe($.if(dev, gulp.dest('public/dist/fonts'), gulp.dest('public/dist/fonts')));
});


gulp.task('images', () => {
    return gulp.src('public/images/**/*')
        .pipe($.cache($.imagemin()))
        .pipe(gulp.dest('public/dist/images'));
});



gulp.task('clean', del.bind(null, ['public/.tmp', 'public/dist','.tmp']));

gulp.task('webserver', function() {
  connect.server({
    livereload: true,
    root: ['.', '.tmp']
  });
});

gulp.task('dev',() =>{
    runSequence('clean',['styles','scripts','images','fonts']);
    gulp.watch([
        'public/*.html',
        'public/images/**/*',
    ]).on('change', reload);
    gulp.watch('public/images/**/*', ['images']);
    gulp.watch('public/styles/**/*.scss', ['styles']);
    gulp.watch('public/scripts/**/*.scripts', ['scripts']);
    gulp.watch('public/fonts/**/*', ['fonts']);

});
gulp.task('build',()=>{
    runSequence('clean',['stylesmin','scriptsmin','images','fonts'])
});
gulp.task('default', () => {
    return new Promise(resolve => {
        dev = false;
        runSequence(['clean'], 'build', resolve);
    });
});

var gulp = require('gulp'),
    eslint = require('gulp-eslint'),
    header = require('gulp-header'),
    uglify = require('gulp-uglify'),
    plumber = require('gulp-plumber'),
    clean = require('gulp-clean'),
    rename = require('gulp-rename'),
    package = require('./package.json'),
    karmaServer = require('karma').Server;

var paths = {
    output: 'dist/',
    scripts: [
        'src/angular-domcomponent.js'
    ]
};

var banner = [
    '/*! ',
    '<%= package.name %> ',
    'v<%= package.version %> | ',
    '(c) ' + new Date().getFullYear() + ' <%= package.author %> |',
    ' <%= package.homepage %>',
    ' */',
    '\n'
].join('');

function runKarma(singleRun, done) {
    var browsers = ['PhantomJS'];
    if (!singleRun) {
        browsers.push('Chrome');
    }
    new karmaServer({
        configFile: __dirname + '/karma.conf.js',
        singleRun: singleRun,
        browsers: browsers,
    }, done).start();
}


gulp.task('scripts', ['clean'], function() {
    return gulp.src(paths.scripts)
        .pipe(plumber())
        .pipe(header(banner, { package: package }))
        .pipe(gulp.dest('dist/'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(header(banner, { package: package }))
        .pipe(gulp.dest('dist/'));
});

gulp.task('lint', function() {
    return gulp.src(paths.scripts)
        .pipe(eslint())
        .pipe(eslint.format());
});

gulp.task('clean', function() {
    return gulp.src(paths.output, { read: false })
        .pipe(plumber())
        .pipe(clean());
});

gulp.task('test', function(done) {
    runKarma(false, done);
});

gulp.task('test-ci', function(done) {
    runKarma(true, done);
});

gulp.task('watch', function() {
    gulp.watch(paths.scripts, ['default']);
});

gulp.task('default', [
    'lint',
    'clean',
    'scripts'
]);

gulp.task('dev', [
    'watch',
    'default'
]);

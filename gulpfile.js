let gulp = require('gulp'),
    sass = require('gulp-sass'),
    rename = require('gulp-rename'),
    browserSync = require('browser-sync'),
    autoprefixer = require('gulp-autoprefixer'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    cssmin = require('gulp-cssmin'),
    del = require('del');

gulp.task('sass', function(){
    return gulp.src('app/scss/**/*.scss')
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(rename({suffix: '.min'}))
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 8 version']
        }))
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.stream());
});


gulp.task('html', function(){
    return gulp.src('app/*.html')
        .pipe(browserSync.stream())
})

gulp.task('js', function () {
    return gulp.src('app/js/*.js')
        .pipe(browserSync.stream())
})

gulp.task('watch', function(){
    gulp.watch('app/scss/**/*.scss', gulp.parallel('sass'))
    gulp.watch('app/*.html', gulp.parallel('html'))
    gulp.watch('app/*.js', gulp.parallel('js'))
});

gulp.task('browser-sync', function () {
    browserSync.init({
        server: {
            baseDir: "app/"
        }
    })
});

gulp.task('scripts', function(){
    return gulp.src([
        'node_modules/slick-carousel/slick/slick.js'
    ])
    .pipe(concat('libs.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('app/js'))
});

gulp.task('styles', function(){
    return gulp.src([
        'node_modules/slick-carousel/slick/slick.css',
        'node_modules/slick-carousel/slick/slick-theme.css',
        'node_modules/normalize.css/normalize.css'
    ])
    .pipe(concat('libs.min.css'))
    .pipe(cssmin())
    .pipe(gulp.dest('app/css'))
});

gulp.task('export', async function(){
    gulp.src('app/**/*.html')
        .pipe(gulp.dest('dist'));
    
    gulp.src('app/css/**/*.css')
        .pipe(gulp.dest('dist/css'));

    gulp.src('app/js/**/*.js')
        .pipe(gulp.dest('dist/js'));
    
    gulp.src('app/img/**/*.*')
        .pipe(gulp.dest('dist/img'));
        
    gulp.src('app/fonts/**/*.*')
        .pipe(gulp.dest('dist/fonts'));
});

gulp.task('clean', async function(){
    del.sync('dist')
});

gulp.task('minjs', function () {
    return gulp.src('app/js/main.min.js')
        .pipe(uglify())
        .pipe(gulp.dest('app/js'))
});

gulp.task('build', gulp.series('clean', 'export'));

gulp.task('default', gulp.parallel('styles', 'scripts', 'sass', 'watch', 'browser-sync'))
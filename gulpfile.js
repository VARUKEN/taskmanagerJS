var gulp, webpack;

gulp = require('gulp');
webpack = require('gulp-webpack');

gulp.task('copy-css', function() {
   return gulp
    .src('src/css/**/*.css')
    .pipe(gulp.dest('dist/css/'))
});

gulp.task('copy-images', function() {
    return gulp
        .src('src/img/**/*.{jpg,jpeg,gif,png}')
        .pipe(gulp.dest('dist/img/'));
});

gulp.task('copy-html', function() {
    return gulp
        .src('src/**/*.html')
        .pipe(gulp.dest('dist/'));
});

gulp.task('js', function() {
  return gulp
    .src('src/js/main.js')
    .pipe(
        webpack({
            debug: true,
            output: {
                filename: 'main.js'
            }
        })
    ).pipe(
        gulp.dest('dist/js/')
    );
});

gulp.task('copy', ['copy-css', 'copy-images', 'copy-html']);
gulp.task('default', ['copy', 'js'])

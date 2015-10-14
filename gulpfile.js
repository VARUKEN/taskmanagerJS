var gulp, webpack;

gulp = require('gulp');
webpack = require('gulp-webpack');

gulp.task('default', function() {
  return gulp.src('src/js/main.js')
    .pipe(
        webpack({
            debug: true,
            output: {
                filename: 'main.js'
            }
        })
    ).pipe(
        gulp.dest('dist/')
    );
});

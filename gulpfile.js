const gulp = require('gulp');
const uglify = require('gulp-uglify');
const umd = require('gulp-umd');
const rename = require('gulp-rename');

gulp.task('uglify', () => {
  return gulp.src('./WorkerFunction.js')
    .pipe(umd())
    .pipe(uglify())
    .pipe(rename('wf.min.js'))
    .pipe(gulp.dest('dist'))
  ;
});


gulp.task('default', ['uglify'], () =>{
  return gulp.src('./WorkerFunction.js')
    .pipe(umd())
    .pipe(rename('wf.js'))
    .pipe(gulp.dest('dist'))
  ;
});

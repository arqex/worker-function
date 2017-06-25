const gulp = require('gulp');
const uglify = require('gulp-uglify');
const umd = require('gulp-umd');
const rename = require('gulp-rename');
const header = require('gulp-header');

var pkg = require('./package.json');
var comment = `/* worker-function v${pkg.version} by Javier Marquez - https://github.com/arqex/worker-function */\n`;

gulp.task('uglify', () => {
  return gulp.src('./WorkerFunction.js')
    .pipe(umd())
    .pipe(uglify())
    .pipe(rename('wf.min.js'))
    .pipe(header(comment))
    .pipe(gulp.dest('dist'))
  ;
});


gulp.task('default', ['uglify'], () =>{
  return gulp.src('./WorkerFunction.js')
    .pipe(umd())
    .pipe(rename('wf.js'))
    .pipe(header(comment))
    .pipe(gulp.dest('dist'))
  ;
});

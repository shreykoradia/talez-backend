const gulp = require('gulp');

gulp.task('copy-templates', () => {
  return gulp.src('src/shared/templates/*.html') // Select all HTML files in the directory
    .pipe(gulp.dest('dist/shared/templates'));
});

gulp.task('build', gulp.series('copy-templates'));
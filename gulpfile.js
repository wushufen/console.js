var gulp = require('gulp');

gulp.task('default');
setTimeout(function() {
    gulp.run('js')
}, 1);


gulp.task('js', function() {
    var rename = require('gulp-rename');
    var uglify = require('gulp-uglify');

    gulp.src('console.js')
        .pipe(uglify({
            preserveComments: 'license'
        }))
        .pipe(rename({ extname: '.min.js' }))
        .pipe(gulp.dest('.'));

})

var gulp = require('gulp')
var gutil = require('gulp-util')

gulp.task('default')
setTimeout(function() {
    gulp.run('js')
}, 1)


gulp.task('js', function() {
    var rename = require('gulp-rename')
    var uglify = require('gulp-uglify')

    gulp.src('src/**.js')
        .pipe(uglify({
            output: {
                comments: 'some'
            }
        }))
        .on('error', function(err) {
            gutil.log(gutil.colors.red('[Error]'), err.toString())
        })
        // .pipe(rename({ extname: '.min.js' }))
        .pipe(gulp.dest('.'))

})

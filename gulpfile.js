const { watch, src, dest } = require('gulp')
const babel = require('gulp-babel')
const uglify = require('gulp-uglify')

var tasks = {
  js(){
    return src('src/*.js')
    .pipe(babel({
      "presets": ["@babel/preset-env"]
    }))
    .pipe(uglify({
      output: {
        comments: 'some'
      }
    }))
    .pipe(dest('dist/'))
  },
  css(){},
  watch(){
    watch('src/*.js', tasks.js)
  },
  default(){
    return tasks.js()
  },
}

exports.watch = tasks.watch
exports.default = tasks.default

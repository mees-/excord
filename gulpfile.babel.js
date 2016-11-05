/* @flow */
import gulp from 'gulp'
import sourceMap from 'gulp-sourcemaps'
import eslint from 'gulp-eslint'
import babel from 'gulp-babel'
import mocha from 'gulp-mocha'
import del from 'del'

const path = {
  allJs: '{src,test}/**/*.js',
  src: 'src/**/*.js',
  test: 'test/**/*.js',
  lib: 'lib/',
  srcDest: 'lib/src/',
  testDest: 'lib/test/**/*.js'
}

gulp.task('clean', () =>
  del(path.lib)
)

gulp.task('build', ['lint', 'clean'], () =>
  gulp.src([path.allJs])
    .pipe(sourceMap.init())
    .pipe(babel())
    .pipe(sourceMap.write('.'))
    .pipe(gulp.dest(path.lib))
)

gulp.task('lint', () =>
  gulp.src([path.allJs])
  .pipe(eslint())
  .pipe(eslint.format())
  .pipe(eslint.failAfterError())
)

gulp.task('test', ['build'], () =>
  gulp.src(path.testDest)
  .pipe(mocha())
)

gulp.task('main', ['test'])

gulp.task('watch', () => {
  gulp.watch(path.allJs, ['main'])
})

gulp.task('default', ['watch', 'main'])

import gulp from 'gulp'
import sourceMap from 'gulp-sourcemaps'
import eslint from 'gulp-eslint'
import babel from 'gulp-babel'
import mocha from 'gulp-mocha'
import del from 'del'

const path = {
  src: 'src/**/*.js',
  test: 'test/**/*.js',
  srcDest: 'libSrc',
  testDest: 'libTest',
  builtTest: 'libTest/**/*.js'
}

gulp.task('cleanSrc', () =>
  del(path.srcDest)
)

gulp.task('cleanTest', () =>
  del(path.testDest)
)

gulp.task('buildSrc', ['lintSrc', 'cleanSrc'], () =>
  gulp.src(path.src)
    .pipe(sourceMap.init())
    .pipe(babel())
    .pipe(sourceMap.write('.'))
    .pipe(gulp.dest(path.srcDest))
)

gulp.task('buildTest', ['lintTest', 'cleanTest', 'buildSrc'], () =>
  gulp.src(path.test)
  .pipe(sourceMap.init())
  .pipe(babel())
  .pipe(sourceMap.write('.'))
  .pipe(gulp.dest(path.testDest))
)

gulp.task('lintSrc', () =>
  gulp.src(path.src)
  .pipe(eslint())
  .pipe(eslint.format())
  .pipe(eslint.failAfterError())
)

gulp.task('lintTest', () =>
  gulp.src(path.test)
  .pipe(eslint())
  .pipe(eslint.format())
  .pipe(eslint.failAfterError())
)

gulp.task('test', ['buildTest'], () =>
  gulp.src(path.builtTest)
  .pipe(mocha())
)

gulp.task('main', ['test'])

gulp.task('watch', () => {
  gulp.watch(path.src, ['main'])
  gulp.watch(path.test, ['main'])
})

gulp.task('default', ['watch', 'main'])
gulp.task('buildWatch', ['buildTest'], () => {
  gulp.watch(path.src, ['buildTest'])
  gulp.watch(path.test, ['buildTest'])
})

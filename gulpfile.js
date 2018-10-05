var gulp = require('gulp');

var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();

var uglify = require('gulp-uglify');

//minify css
var cssnano = require('gulp-cssnano');

var imagemin = require('gulp-imagemin');

var cache = require('gulp-cache');

//deleted files that are no longer useed
var del = require('del');

//help run gulp tasks in sequence
var runSequence = require('run-sequence');

var autoprefixer = require('gulp-autoprefixer');

var babel = require('gulp-babel');

var concat = require('gulp-concat');

var critical = require('critical');

gulp.task('critical', ['build'], function(cb) {
  critical.generate({
    inline: true, 
    base: 'dist/',
    src: 'index.html',
    dest: 'dist.index-critical.html',
    minify: true
  });
});

gulp.task('toES6', function() {
  gulp.src('js/index.js')
  .pipe(babel({
    plugins: ['transform-object-assign'],
    presets: ['env']
  }))
  .pipe(gulp.dest('js'))
});

gulp.task('prefix',function() {
  gulp.src('css/main.css')
  .pipe(autoprefixer({
    browsers: ['last 10 version'],
    cascade: false
  }))
  .pipe(gulp.dest('dist/css'))
})

gulp.task('clean:dist', function() {
  return del.sync('dist');
});

gulp.task('fonts', function() {
  return gulp.src('fonts/**/*')
  .pipe(gulp.dest('dist/fonts'))
});

gulp.task('images', function() {
  return gulp.src('images/**/*.+(png|jpg|gif|svg)')
  .pipe(cache(imagemin({
    interlaced: true
  })))
  .pipe(gulp.dest('dist/images'))
});

gulp.task('html', function() {
   return gulp.src(['index.html']).pipe(gulp.dest('dist'))
})

gulp.task('uglify', function(){
  return gulp.src('js/index.js')
         .pipe(uglify())
         .pipe(gulp.dest('dist/js'))
});

/*gulp.task('concat', function(){
  return gulp.src(['js/index.js'])
         .pipe(concat('js/all.js')).pipe(gulp.dest('./'));
});*/

gulp.task('minifycss', function(){
  return gulp.src('dist/css/main.css')
  .pipe(cssnano()).pipe(gulp.dest('dist/css'));
});

gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: '../yota-red'
    },
  })
});

gulp.task('sass', function() {
  return gulp.src('sass/**/*.scss')
  .pipe(sass.sync().on('error', sass.logError))
  .pipe(gulp.dest('css'))
  .pipe(browserSync.reload({
    stream: true
  }))
});

gulp.task('watch',['browserSync', 'sass'], function() {
  gulp.watch('sass/**/*.scss', ['sass']);
  gulp.watch('*.html', browserSync.reload);
  gulp.watch('js/**/*.js', browserSync.reload);
});

gulp.task('build', function(callback) {
  runSequence('clean:dist', ['sass', 'prefix', 'minifycss', 'uglify', 'images', 'html', 'fonts'], callback)
});

gulp.task('develop', function(callback) {
  runSequence(['sass', 'browserSync', 'watch'],
    callback)
});
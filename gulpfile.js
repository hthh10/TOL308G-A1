var gulp        = require('gulp');
var browserSync = require('browser-sync').create();
var sass        = require('gulp-sass');
var jshint        = require('gulp-jshint');

// Static Server + watching scss/html files
gulp.task('serve', ['sass'], function() {

    browserSync.init({
        server:{      baseDir: "./"
      }
    });

    gulp.watch(["./*.scss"], ['sass']);
    gulp.watch(["./*.html", "./*.js"]).on('change', browserSync.reload);
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
         gulp.src("./*.scss")
        .pipe(sass())
        .pipe(gulp.dest("./"))
        .pipe(browserSync.stream());
});

gulp.task('inspect', function() {
        return gulp.src("./*.js")
        .pipe(jshint())
        .pipe(jshint.reporter("default"));
});
//gulp.task('default', ['inspect','sass','serve']);
gulp.task('default', ['serve']);

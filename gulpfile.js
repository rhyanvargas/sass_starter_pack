const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const sassdoc = require('sassdoc');

// Variables
var sassOptions = {
    errLogToConsole: true,
    outputStyle: 'expanded'
};
var autoprefixerOptions = {
    browsers: ['last 2 versions', '> 5%', 'Firefox ESR', 'ie 8', 'ie 9']
};
var sassdocOptions = {
    dest: './public/sassdocs'
}


// Compile Sass & Inject Into Browser
gulp.task('sass', function () {
    return gulp
         // Find all `.scss` files from the `css/` folder
        .src(['./src/sass/*.scss'])
        // Compile css in expanded mode and to print errors in console:
        .pipe(sass(sassOptions).on('error',sass.logError))
        // Show which specific Sass partial your CSS came from (Debugging in Chrome Dev Tools)
        .pipe(sourcemaps.write('/assets/css/maps'))
        // Support last 2 versions of every browsers, and IE 8,9
        .pipe(autoprefixer(autoprefixerOptions))
        // Write the resulting CSS in the output folder
        .pipe(gulp.dest("./assets/css/"))
        // Responsible for streaming the CSS changes and injecting them into the browser
        .pipe(browserSync.stream())
});

// Generate Sass documentation
gulp.task('sassdoc', function() {
    return gulp 
        .src(['./src/sass/*/*.scss'])
        .pipe(sassdoc(sassdocOptions))
        // Release the pressure back and trigger flowing mode (drain)
        // See: http://sassdoc.com/gulp/#drain-event
        .resume();
});

// Watch Sass & Serve
gulp.task('serve', ['sass'], function () {
    browserSync.init({
        injectChanges: true,
        server: "./"
    })
    gulp.watch(['./src/sass/*/*.scss'], ['sass']);
    gulp.watch('*.html').on('change', browserSync.reload);
});

// // Make Production Ready
// gulp.task('prod', ['sassdoc'], function() {
//     return gulp
//         .src('sass/*.scss')
//         .pipe(sass({outputStyle: 'compressed'}))
//         .pipe(autoprefixer(autoprefixerOptions))
//         .pipe(gulp.dest('./dist'))
// });

// Default Task
gulp.task('default', ['serve', 'sassdoc']);
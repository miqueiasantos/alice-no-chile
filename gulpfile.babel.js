const gulp = require('gulp');
const browserSync = require('browser-sync');
const sass = require('@selfisekai/gulp-sass');
const prefix = require('gulp-autoprefixer');
const cssnano = require('gulp-cssnano');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');
const imagemin = require('gulp-imagemin');

sass.compiler = require('sass');

const startServer = (done) => {
    browserSync.init({
        server: "./",
        port: 3030
    })
    done()
}

const browserSyncReload = (done) => {
    browserSync.reload()
    done()
}

const compileScripts = () => {
    return gulp.src(['assets/js/*.js'])
        .pipe(babel({
            "presets": ["@babel/preset-env"]
        }))
        .pipe(concat('scripts.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js/'))
        .pipe(browserSync.reload({ stream: true }))
}

const compileStyles = () => {
    return gulp.src('assets/scss/styles.scss')
        .pipe(sass({
            includePaths: ['scss'],
            onError: browserSync.notify
        }))
        .pipe(prefix(['last 3 versions'], { cascade: true }))
        .pipe(cssnano())
        .pipe(sourcemaps.write('./dist/css/'))
        .pipe(gulp.dest('./dist/css/'))
        .pipe(browserSync.reload({ stream: true }))
}

const compileImages = () => {
    return gulp.src('assets/images/**')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/images'))
}

const watchMarkup = () => {
    gulp.watch(['*.html'], browserSyncReload);
}

const watchScripts = () => {
    gulp.watch(['assets/js/*.js'], compileScripts);
}

const watchStyles = () => {
    gulp.watch(['assets/scss/*.scss'], compileStyles)
}

const watchImages = () => {
    gulp.watch(['assets/images/**'], compileImages)
}


const compile = gulp.parallel(compileScripts, compileStyles, compileImages)
compile.description = 'compile all sources'

// Not exposed to CLI
const serve = gulp.series(compile, startServer)
serve.description = 'serve compiled source on local server at port 3000'

const watch = gulp.parallel(watchMarkup, watchScripts, watchStyles, watchImages)
watch.description = 'watch for changes to all source'

const defaultTasks = gulp.parallel(serve, watch)

export {
    compile,
    compileScripts,
    compileStyles,
    compileImages,
    serve,
    watch,
    watchMarkup,
    watchScripts,
    watchStyles,
    watchImages,
}

export default defaultTasks
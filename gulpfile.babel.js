const gulp = require('gulp'),
plugins = require('gulp-load-plugins')();

 connect = require('gulp-connect'),
 sass = require('gulp-sass'),
 babel = require('gulp-babel'),
 print = require('gulp-print'),
 autoprefixer = require('gulp-autoprefixer'),
 watch = require('gulp-watch'),
 imagemin = require('gulp-imagemin');

// Set the app and genveral Paths
const appPath = './';
const buildPath = `${appPath}/build`;
const sourcePath = `${appPath}/src`;
const distPath = `${appPath}/dist`;

// Set the build Paths
const cssBuildPath = `${buildPath}/css/`;
const imgBuildPath = `${buildPath}/img/`;
const jsBuildPath = `${buildPath}/js/`;
const fontBuildPath = `${buildPath}/font/`;

const allHtmlSourcePath = `${sourcePath}/**/*.html`;
const allImgSourcePath = `${sourcePath}/img/**/*.*`;
const pngImgSourcePath =`${sourcePath}/img/**/*.png`;
const svgImgSourcePath =`${sourcePath}/img/**/*.svg`;
const jpgImgSourcePath =`${sourcePath}/img/**/*.jpg`;
const gifImgSourcePath =`${sourcePath}/img/**/*.gif`;
const fontSourcePath = `${sourcePath}/font/*.ttf`;
const sassSourcePath = `${sourcePath}/css/sass/**/*.scss`;
const vendorCssSourcePath = `${sourcePath}/css/**/*.min.css`;
const vendorJSSourcePath = `${sourcePath}/js/**/*.js`;
const customJSSourcePath = `${sourcePath}/js/*.js`;

//const alljsBuildPath = `${sourcePath}/js/**/*.js`;

gulp.task('images', () => {
  return gulp.src([`${pngImgSourcePath}`, `${svgImgSourcePath}`, `${gifImgSourcePath}`, `${jpgImgSourcePath}`,`!${sourcePath}/img/_src/**`])
    .pipe(imagemin())
    .pipe(gulp.dest(`${imgBuildPath}`));
});

// html Processing and copy
gulp.task('html', () => {
  return gulp.src(`${allHtmlSourcePath}`)

  // .pipe(plugins.connect.reload())
    .pipe(print(filePath => {
      return `Copying -> ${filePath}`;
    }))
   .pipe(gulp.dest(`${buildPath}`));
});

// Compile SASS TODO: Look into source maps & SassDocs : maybe https://www.sitepoint.com/simple-gulpy-workflow-sass/
gulp.task('sass', ['css'], () => {

  let sassOptions = {
      errLogToConsole: true,
      outpitStyle: 'expanded'
  };
  let autoPrefixerOptions = {
    browsers: ['last 2 versions', '> 5%', 'Firefox ESR']
  }

  return gulp.src(`${sassSourcePath}`)
    .pipe(plugins.sass(sassOptions).on('error', plugins.sass.logError))
    .pipe(autoprefixer(autoPrefixerOptions))
    .pipe(gulp.dest(`${cssBuildPath}`));
});
gulp.task('css', () => {
  return gulp.src(`${vendorCssSourcePath}`)
    .pipe(gulp.dest(`${cssBuildPath}`));
});

// fonts Processing and copy
gulp.task('font', () => {
  return gulp.src(`${fontSourcePath}`)
   .pipe(plugins.connect.reload())
   .pipe(gulp.dest(`${fontBuildPath}`));
});

// JS Processing and copy
gulp.task('js', ['vendorJS'], () => {
  return gulp.src(`${customJSSourcePath}`)
    .pipe(print(filePath => {
        return `Transpiling -> ${filePath}`;
    }))
    .pipe(babel({ presets: ['env'] }))
    .pipe(gulp.dest(`${jsBuildPath}`))
    .pipe(connect.reload());
});

// Move vendor js to the corresponding build folder
gulp.task('vendorJS', () =>{
 return gulp.src(`${vendorJSSourcePath}`)
   .pipe(print(filePath => {
     return `Copying -> ${filePath}`;
   }))
   .pipe(gulp.dest(`${jsBuildPath}`));
});

// BUILD - RUN - WATCH - RELEASE
// CREATE A DISTIBUTION BUILD
gulp.task('dist', () => {
  return gulp.src(`${buildPath}/**/*`)
   .pipe(gulp.dest(`${distPath}`));
});

// Connect / Watch and Defaults.
gulp.task('connect', () => {
  connect.server({
    root: `${buildPath}`,
    livereload: true
  });
});

gulp.task('watch', () => {
  return gulp
    .watch([`${allHtmlSourcePath}`, `${sassSourcePath}`,`${customJSSourcePath}`], ['html', 'sass','js'])
    .on('change', function(evt){
      console.log(`FILE: ${evt.path} was ${evt.type} running tasks`);
    });
});

gulp.task('build', ['js', 'html', 'images', 'sass', 'font']);


gulp.task('serve', ['connect', 'watch']);

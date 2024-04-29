const gulp = require('gulp'),  babel = require('gulp-babel'),  prefix = require('gulp-autoprefixer'),  sass = require('gulp-sass'),  cleanCSS = require('gulp-clean-css'),  rename = require("gulp-rename"),  uglify = require('gulp-uglify'),  concat = require('gulp-concat'),  plumber = require('gulp-plumber'),  concatCss = require('gulp-concat-css'),  sync = require('browser-sync'),  nunjucks = require('gulp-nunjucks'),  prettify = require('gulp-html-prettify'),  data = require('gulp-data'),  fs = require('fs'),  reload = sync.reload;// --------------------------------------------If you need icon fontsconst iconfont = require('gulp-iconfont'),  iconfontCss = require('gulp-iconfont-css'),  fontName = 'Icons';const iconFonts = () => {  return gulp.src(['app/i/icons/*.svg'])    .pipe(iconfontCss({      fontName: fontName,      path: 'app/sass/iconfont/_icons.scss',      targetPath: '../sass/icons/_icons.scss',      fontPath: '../fonts/'    }))    .pipe(iconfont({      fontName: fontName,      formats: ['ttf', 'eot', 'woff', 'woff2', 'svg'],      normalize: true,      fontHeight: 1001,      centerHorizontally: true    }))    .pipe(gulp.dest('app/fonts/'));};exports.iconFonts = iconFonts;// html taskconst html = () => {  return gulp.src('app/html/*.+(html|njk|twig)')    .pipe(data(function() {      return JSON.parse(fs.readFileSync('./app/html/data/data.json'))    }))    .pipe(nunjucks.compile())    .pipe(prettify({      indent_size : 2    }))    .pipe(gulp.dest('./dist'))    .pipe(reload({stream: true}));}exports.html = html;// Stylesconst style = () => {  return gulp.src('app/sass/**/*.scss')    .pipe(plumber())    .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))    .pipe(prefix('last 10 versions'))    .pipe(gulp.dest('dist/css/'))    .pipe(cleanCSS())    .pipe(rename({suffix: ".min"}))    .pipe(gulp.dest('dist/css/'))    .pipe(reload({stream: true}));};exports.style = style;// Styles libsconst styleLibs = () => {  return gulp.src(    [      './node_modules/@fancyapps/fancybox/dist/jquery.fancybox.css',    ]  )    .pipe(concatCss("lib.min.css"))    .pipe(cleanCSS())    .pipe(gulp.dest('dist/css/'));};exports.styleLibs = styleLibs;// Scriptsconst js = () => {  return gulp.src('app/js/main.js')    .pipe(babel({      presets: ['@babel/preset-env']    }))    .pipe(plumber())    .pipe(gulp.dest('dist/js/'))    .pipe(uglify())    .pipe(rename("main.min.js"))    .pipe(gulp.dest('dist/js/'))    .pipe(reload({stream: true}));};exports.js = js;// Scripts libsconst jsLibs = () => {  return gulp.src(    ['node_modules/jquery/dist/jquery.min.js',      './node_modules/@fancyapps/fancybox/dist/jquery.fancybox.js',      'node_modules/inputmask/dist/jquery.inputmask.js',    ]  )    .pipe(concat("lib.min.js"))    .pipe(gulp.dest('dist/js/'));};exports.jsLibs = jsLibs;// Copyconst copy = () => {  return gulp.src([    'app/fonts/**/*',    'app/images/**/*',    'app/sass/**/*',    'app/i/**/*',  ], {    base: 'app'  })    .pipe(gulp.dest('dist'))    .pipe(sync.stream({      once: true    }));};exports.copy = copy;// Serverconst server = () => {  let files = [    'app/sass/**/*.scss'  ]  sync.init(files,{    ui: false,    notify: false,    server: {      baseDir: 'dist'    }  });};exports.server = server;// Watchconst watch = () => {  gulp.watch('app/html/**/*.+(html|njk|twig)', gulp.series(html));  gulp.watch('app/sass/**/*.scss', gulp.series(style));  gulp.watch('app/js/**/*.js', gulp.series(js));  gulp.watch([    'app/fonts/**/*',    'app/images/**/*',  ], gulp.series(copy));};exports.watch = watch;// Defaultexports.default = gulp.series(  gulp.parallel(    html,    style,    js,    styleLibs,    jsLibs,    copy,  ),  gulp.parallel(    watch,    server,  ),);
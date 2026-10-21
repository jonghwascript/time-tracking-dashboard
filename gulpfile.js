const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const sourcemaps = require('gulp-sourcemaps');
const cleanCSS = require('gulp-clean-css'); // CSS 압축용
const browserSync = require('browser-sync').create(); // 로컬 서버 + 자동 새로고침

// 포맷 대상 파일
const PRETTIER_GLOBS = ['src/scss/**/*.scss', '*.html', 'gulpfile.js'];

// SCSS → CSS 변환
function scssTask() {
  return gulp
    .src('src/scss/**/*.scss') // SCSS 위치
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError)) // SCSS 변환
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('css')) // CSS 출력 위치
    .pipe(browserSync.stream({ match: '**/*.css' })); // 새로고침 없이 CSS만 교체 (.map은 제외)
}

// Prettier로 코드 포맷팅 (gulp-prettier는 ESM 전용이라 동적 import 필요)
async function prettierTask() {
  const { default: prettier } = await import('gulp-prettier');
  return gulp
    .src(PRETTIER_GLOBS, { base: '.' })
    .pipe(prettier())
    .on('error', function (err) {
      console.error('[prettier]', err.message);
      this.emit('end'); // 포맷 오류가 있어도 watch가 죽지 않도록
    })
    .pipe(gulp.dest('.')); // 원본 위치에 덮어쓰기
}

// 프로젝트 루트를 정적 서버로 띄운다 (file:// 에서는 data.json을 불러오지 못함)
function serveTask(done) {
  browserSync.init({
    server: { baseDir: './' },
    notify: false, // 브라우저 우측 상단 알림 끄기
  });
  done();
}

// 페이지 전체 새로고침
function reloadTask(done) {
  browserSync.reload();
  done();
}

// 변경 감시: SCSS는 CSS 주입, HTML·JS·데이터는 새로고침
function watchTask() {
  gulp.watch('src/scss/**/*.scss', scssTask);
  gulp.watch(['*.html', 'js/**/*.js', 'data.json'], reloadTask);
}

exports.prettier = prettierTask;

// 기본 태스크
exports.default = gulp.series(prettierTask, scssTask, serveTask, watchTask);

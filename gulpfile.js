var gulp = require('gulp');
var webpack = require('webpack');
var webpackConfig = require('./webpack.config.js');

gulp.task('webpack', function (callback) {
  webpack(webpackConfig,  function(err, stats) {
    if(err) throw new gutil.PluginError('webpack', err);
    console.log('[webpack]', stats.toString({}));
    callback();
  });
});

gulp.task('watch', function () {
  gulp.watch(['./src/*.js', './src/es6/*.js', './src/jsx/*.jsx', './src/scss/*.scss'], ['webpack']);
});

gulp.task('default', ['watch']);

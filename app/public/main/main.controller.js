'use strict';

angular.module('WallpaperCurator.main')

.controller('MainCtrl', function($scope, $window, $interval, Backend) {

  var slideShowIntervalTime = 10000,
    timer;

  $scope.data = {
    dir: 'D:\\TEMP\\pics'
  };

  $scope.app = {
    isRunning: false,
    initialized: false
  };

  function start() {
    timer = $interval(Backend.setNextWallpaper, slideShowIntervalTime);
    $scope.app.isRunning = true;
  }

  function stop() {
    $interval.cancel(timer);
    timer = null;
    $scope.app.isRunning = false;
  }

  function shuffle() {
    Backend.shuffle();
  }

  $scope.start = start;
  $scope.stop = stop;
  $scope.shuffle = shuffle;

  $window.resizeTo($window.screen.availWidth, $window.screen.availHeight)

  Backend.init($scope.data.dir).then(function() {
    $scope.$apply(function() {
      $scope.app.initialized = true;
    });
  });

});
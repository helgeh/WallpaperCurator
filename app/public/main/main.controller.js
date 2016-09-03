'use strict';

angular.module('WallpaperCurator.main')

.controller('MainCtrl', function($scope, $window, $interval, Images) {

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
    timer = $interval(Images.setNextWallpaper, slideShowIntervalTime);
    $scope.app.isRunning = true;
  }

  function stop() {
    $interval.cancel(timer);
    timer = null;
    $scope.app.isRunning = false;
  }

  function prev() {
    stop();
    Images.setPrevWallpaper();
  }

  function next() {
    Images.setNextWallpaper();
  }

  function shuffle() {
    Images.shuffle();
  }

  $scope.start = start;
  $scope.stop = stop;
  $scope.prev = prev;
  $scope.next = next;
  $scope.shuffle = shuffle;

  $window.resizeTo($window.screen.availWidth, $window.screen.availHeight)

  Images.init($scope.data.dir).then(function() {
    $scope.$apply(function() {
      $scope.app.initialized = true;
    });
  });

});
'use strict';

angular.module('WallpaperCurator.main')

.controller('MainCtrl', function($scope, $window, $interval, Images) {

  var timer;

  $scope.data = {
    dir: 'D:\\TEMP\\pics'
  };
  $scope.data.intervalOptions = [
    {time: 0.1666, label: "10 seconds"},
    {time: 3, label: "3 min"},
    {time: 10, label: "10 min"},
    {time: 30, label: "30 min"},
    {time: 60, label: "60 min"}
  ];
  $scope.data.intervalTime = $scope.data.intervalOptions[0];

  $scope.app = {
    isRunning: false,
    initialized: false
  };

  function start() {
    timer = $interval(Images.setNextWallpaper, getIntervalTime());
    $scope.app.isRunning = true;
  }

  function getIntervalTime() {
    return $scope.data.intervalTime.time * 60 * 1000;
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
  }, function (err) {
    console.log(err);
  });

});
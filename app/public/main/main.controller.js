'use strict';

angular.module('WallpaperCurator.main')

.controller('MainCtrl', function($scope, $interval, Backend) {

	$scope.data = {
		dir: 'D:\\test\\'
	};

	$scope.app = {
		isRunning: false,
		initialized: false
	};

	var random;
	function startRandom() {
		random = $interval(setNextWallpaper, 10000, 10);
		$scope.app.isRunning = true;
	}

	function stopRandom() {
		$interval.cancel(random);
		random = null;
		$scope.app.isRunning = false;
	}

	var counter = 0;
	function setNextWallpaper() {
		counter = Math.min(allFiles.length-1, counter+1);
		var path = allFiles[counter].path;
		path = path.replace(/\\/g, '\\\\');
		Backend.setWallpaper(path);
	}

	$scope.startRandom = startRandom;
	$scope.stopRandom = stopRandom;


	// Backend.getFiles($scope.data.dir).then(function(response) {
	// 	$scope.$apply(function(){
	// 		if (response.files) {
	// 			allFiles = response.files;
	// 			$scope.initialized = true;
	// 		}
	// 	});
	// });
	
	$scope.app.initialized = true;

	
	$scope.debug = function(data) {
		return JSON.stringify(data, null, 2);
	};

});
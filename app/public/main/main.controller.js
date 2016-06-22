'use strict';

angular.module('WallpaperCurator.main')

.controller('MainCtrl', function($scope, $http, $interval, Backend) {

	var allFiles;

	$scope.response = "";
	$scope.data = {
		dir: 'D:\\test\\'
	};

	function setDirectory() {
		Backend.getFiles($scope.data.dir).then(function(response) {
			$scope.$apply(function(){
				$scope.response = response.status;
				if (response.files) {
					allFiles = response.files;
					$scope.data.dupes = getDupes(allFiles);
				}
			});
		});
	}

	function getDupes(files) {
		var sorted = _.sortBy(_.sortBy(files, 'fileName.size').reverse(), 'size');
		return _.reduce(sorted, function(result, item, index, coll) {
			var dupes = _.filter(coll, {size: item.size});
			if (dupes && dupes.length > 1) {
				var min = _.min(_.map(dupes, 'fileName.length'));
				var firstOfItsSize = !(result[item.size]);
				item.toggled = !firstOfItsSize;
				(result[item.size] || (result[item.size] = [])).push(item);
			}
			return result;
		}, {});
	}

	function hasDupes() {
		return _.keys($scope.data.dupes).length > 0;
	}

	function toggleDupe(file) {
		file.toggled = !file.toggled;
	}

	function purge() {
		var toDelete = _.reduce($scope.data.dupes, function(result, value/*, key*/) {
			_.filter(value, function(item){ return item.toggled; })
			.forEach(function(item){result.push(item);});
			return result;
		}, []);
		Backend.deleteFiles(toDelete).then(function () {
			setDirectory();
		});
	}

	function reload() {
		Backend.win.reload();
	}

	var random;
	function startRandom() {
		random = $interval(setNextWallpaper, 10000, 10);
		$scope.isRunning = true;
	}

	function stopRandom() {
		$interval.cancel(random);
		random = null;
		$scope.isRunning = false;
	}

	var counter = 0;
	function setNextWallpaper() {
		counter = Math.min(allFiles.length-1, counter+1);
		var path = allFiles[counter].path;
		path = path.replace(/\\/g, '\\\\');
		Backend.setWallpaper(path);
	}

	$scope.setDirectory = setDirectory;
	$scope.hasDupes = hasDupes;
	$scope.toggleDupe = toggleDupe;
	$scope.purge = purge;
	$scope.reload = reload;
	$scope.startRandom = startRandom;
	$scope.stopRandom = stopRandom;
	$scope.isRunning = false;


	Backend.getFiles($scope.data.dir).then(function(response) {
		$scope.$apply(function(){
			$scope.response = response.status;
			if (response.files) {
				allFiles = response.files;
			}
		});
	});

	
	$scope.debug = function(data) {
		return JSON.stringify(data, null, 2);
	};

});
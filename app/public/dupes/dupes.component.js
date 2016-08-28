'use strict';

function DupesController($scope, $rootScope, Backend) {

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
      Backend.reload().then(function(){
        $scope.$apply(function(){
          $scope.data.dupes = Backend.getDuplicatesOfCurrentDir();
        });
      });
		});
	}

  $scope.data = {dupes: Backend.getDuplicatesOfCurrentDir()};

	$scope.hasDupes = hasDupes;
	$scope.toggleDupe = toggleDupe;
	$scope.purge = purge;

}

angular.module('WallpaperCurator.dupes', [])

.component('dupeFiles', {
	templateUrl: './dupes/dupes.html',
	controller: DupesController
});

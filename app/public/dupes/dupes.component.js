'use strict';

function DupesController($scope, $rootScope, Backend) {

  $scope.data = {};

	function hasDupes() {
		return _.keys($scope.data.dupes).length > 0;
	}

	function toggleDupe(file) {
		file.toggled = !file.toggled;
	}

  function isItemToggled(item) {
    return item.toggled;
  }

	function purge() {
		var toDelete = getSelectedFiles();
		Backend.deleteFiles(toDelete).then(reload);
	}

  $scope.hasDupes = hasDupes;
  $scope.toggleDupe = toggleDupe;
  $scope.isItemToggled = isItemToggled;
  $scope.purge = purge;


  function getSelectedFiles() {
    return _.reduce($scope.data.dupes, function(result, value/*, key*/) {
      _.filter(value, isItemToggled)
        .forEach(function(item){
          result.push(item);
        });
      return result;
    }, []);
  }

  function reload() {
    Backend.reload().then(function() {
      $scope.$apply(updateDupes);
    });
  }

  function updateDupes() {
    if (!$scope.data)
      $scope.data = {};
    $scope.data.dupes = Backend.getDuplicatesOfCurrentDir();
  }

  updateDupes();

}

angular.module('WallpaperCurator.dupes', [])

.component('dupeFiles', {
	templateUrl: './dupes/dupes.html',
	controller: DupesController
});

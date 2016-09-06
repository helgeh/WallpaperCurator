'use strict';

function DupesController($scope, $rootScope, Images) {

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
		Images.deleteFiles(toDelete).then(reload);
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
    Images.reload().then(function() {
      $scope.$apply(updateDupes);
    });
  }

  function updateDupes() {
    $scope.data.dupes = Images.getDupes();
  }

  // updateDupes();
  $rootScope.$on('directory_loaded', updateDupes);

}

angular.module('WallpaperCurator.imageDupes', [
  'WallpaperCurator.images'
])

.component('dupeImages', {
	templateUrl: './components/images-dupes/images-dupes.html',
	controller: DupesController
});

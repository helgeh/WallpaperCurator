'use strict';

function WindowControlsController($scope, Desktop) {
  $scope.minimize = function() {
    Desktop.win.hide();
  };

  $scope.close = function() {
    Desktop.win.close();
  };
}

angular.module('WallpaperCurator.controls', [
  'WallpaperCurator.desktop'
])

.component('windowControls', {
  templateUrl: 'components/controls-window-controls/window-controls.html',
  controller: WindowControlsController
});

'use strict';

var _ = require('lodash');

angular.module('WallpaperCurator', [
	'WallpaperCurator.main',
	'WallpaperCurator.files'
])

.config(function($compileProvider) {
	$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension):/);
  // Angular before v1.2 uses $compileProvider.urlSanitizationWhitelist(...)
});


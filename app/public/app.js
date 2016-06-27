'use strict';

var _ = require('lodash');

angular.module('WallpaperCurator', [
	'WallpaperCurator.main',
	'WallpaperCurator.files',
	'WallpaperCurator.assets'
])

.config(function($compileProvider) {
	$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension):/);
	$compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|file|chrome-extension):/);
  // Angular before v1.2 uses $compileProvider.urlSanitizationWhitelist(...)
});


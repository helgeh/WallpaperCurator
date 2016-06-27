
angular.module('WallpaperCurator.files')

.factory('Backend', function () {
	var q = require('q');
	var fs = require('fs');
	var path = require('path');

	var wallpaper = require('wallpaper');


	var currentDirectory;

	function getFiles(dir) {
		currentDirectory = dir;
		return readDir()
			.then(getDimensions);
	}

	var getDimensions = function(response) {
		var files = response.files;
		var deferred = q.defer();
		var errs = [];
		var done = _.after(files.length, function() {
			if (errs.length > 0) 
				deferred.resolve({status: 'errors', files: files, errs: errs});
			else 
				deferred.resolve({status: 'ok', files: files});
		});
		_.forEach(files, function(file){
			var sizeOf = require('image-size');
			var dimensions = sizeOf(file.path);
			if (dimensions) 
				file.dim = dimensions;
			else
				errs.push(new Error('Could not find dimensions for image ' + file.path));
			done();
		});
		return deferred.promise;
	};

	var readDir = function() {
		var deferred = q.defer();
		var allFiles;
		fs.readdir(currentDirectory, function (err, files) {
			if (err) {
				deferred.reject(new Error(err));
				throw err;
			}
			allFiles = files.map(function (file) {
				return {path: path.join(currentDirectory, file), fileName: file};
			}).filter(function (file) {
				return fs.statSync(file.path).isFile();
			}).map(function(file) {
				var stats = fs.statSync(file.path);
				file.stats = stats;
				file.size = stats.size;
				return file;
			});
			deferred.resolve({status: 'ok', files: allFiles});
		});
		return deferred.promise;
	};

	function deleteFiles(files) {
		var deferred = q.defer();
		var done = _.after(files.length, deferred.resolve);
		_.forEach(files, function(file) {
			fs.unlink(file.path, done);
		});
		return deferred.promise;
	}

	function setWallpaper(path) {
		wallpaper.set(path).then(function(){
			console.log("done!");
		});
	}

	return {
		getFiles: getFiles,
		deleteFiles: deleteFiles,
		setWallpaper: setWallpaper
	};
});
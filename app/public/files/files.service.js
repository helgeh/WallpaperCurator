
angular.module('WallpaperCurator.files')

.factory('Backend', function BackendFactory () {
  var q = require('q');
  var fs = require('fs');
  var path = require('path');

  var wallpaper = require('wallpaper');

  var allFiles = [];
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

  function getDuplicatesOfCurrentDir() {
    var sorted = _.sortBy(_.sortBy(allFiles, 'fileName.size').reverse(), 'size');
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
      console.log("Wallpaper has changed!");
    });
  }

  var counter = 0;
  function setNextWallpaper() {
    counter = counter+1;
    if (counter > allFiles.length-1)
      counter = 0;
    var path = allFiles[counter].path;
    path = path.replace(/\\/g, '\\\\');
    setWallpaper(path);
  }

  function init(dir) {
    var deferred = q.defer();
    getFiles(dir).then(function(response) {
      if (response.files) {
        allFiles = response.files;
        deferred.resolve();
      }
      else
        deferred.reject();
    });
    return deferred.promise;
  }

  function reload() {
    return init(currentDirectory);
  }

  return {
    init: init,
    reload: reload,
    setNextWallpaper: setNextWallpaper,
    getDuplicatesOfCurrentDir, getDuplicatesOfCurrentDir,
    deleteFiles: deleteFiles
  };
});
'use strict';

angular.module('WallpaperCurator.images')

.factory('Images', function ImagesFactory () {
  var q = require('q');
  var fs = require('fs');
  var path = require('path');
  var isImage = require('is-image');
  var wallpaper = require('wallpaper');
  var sizeOf = require('image-size');

  var allFiles = [];
  var currentDirectory;

  function getFiles(dir) {
    currentDirectory = dir;
    console.log('new currentDirectory: ' + dir);
    return readDir()
      .then(getDimensions);
  }

  var getDimensions = function(response) {
    console.log('getting image dimensions');
    var files = response.files;
    var deferred = q.defer();
    var errs = [];
    var done = _.after(files.length, function() {
      if (errs.length > 0) {
        console.log('  Errors occured getting dimensions...', errs);
        deferred.resolve({status: 'errors', files: files, errs: errs});
      }
      else {
        console.log('  done getting dimensions');
        deferred.resolve({status: 'ok', files: files});
      }
    });
    _.forEach(files, function(file){
      sizeOf(file.path, function(err, dimensions){
        if (err)
          errs.push(new Error('Could not find dimensions for image ' + file.path));
        else
          file.dim = dimensions;
        done();
      });
    });
    return deferred.promise;
  };

  var readDir = function() {
    console.log('reading currentDirectory...');
    var deferred = q.defer();
    var allFiles;
    fs.readdir(currentDirectory, function (err, files) {
      if (err) {
        console.log('  Error reading currentDirectory ' + currentDirectory, err);
        deferred.reject(new Error(err));
        throw err;
      }
      console.log('  collecting file info');
      allFiles = files.map(function (file) {
        var p = path.join(currentDirectory, file);
        var stats = fs.statSync(p);
        return {path: p, fileName: file, stats: stats, size: stats.size};
      }).filter(function (file) {
        return file.stats.isFile() && isImage(file.path);
      });
      console.log('  files done reading');
      deferred.resolve({status: 'ok', files: allFiles});
    });
    return deferred.promise;
  };

  function getDuplicatesOfCurrentDir() {
    console.log('finding duplicates in currentDirectory');
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
    console.log('deleting ' + files.length + ' files from currentDirectory');
    var deferred = q.defer();
    var done = _.after(files.length, deferred.resolve);
    _.forEach(files, function(file) {
      fs.unlink(file.path, done);
    });
    return deferred.promise;
  }

  function setWallpaper(index) {
    var deferred = q.defer();
    var file = allFiles[index].path;
    file = file.replace(/\\/g, '\\\\');
    wallpaper.set(file).then(function(){
      console.log("Wallpaper has changed!");
      deferred.resolve('Wallpaper changed!');
    }, deferred.reject);
    return deferred.promise;
  }

  var counter = 0;
  function setNextWallpaper() {
    counter = counter+1;
    if (counter > allFiles.length-1)
      counter = 0;
    return setWallpaper(counter);
  }

  function setPrevWallpaper() {
    counter = counter-1;
    if (counter < 0)
      counter = allFiles.length-1;
    return setWallpaper(counter);
  }

  function init(dir) {
    console.log('Initing Images Service');
    var deferred = q.defer();
    getFiles(dir).then(function(response) {
      if (response.files) {
        allFiles = response.files;
        console.log("ALL FILES LOADED AND READY!");
        deferred.resolve();
      }
      else
        deferred.reject();
    }, deferred.reject);
    return deferred.promise;
  }

  function reload() {
    return init(currentDirectory);
  }

  function shuffle() {
    console.log('Shuffling file sequence of currentDirectory');
    allFiles = _.shuffle(allFiles);
  }

  return {
    init: init,
    reload: reload,
    shuffle: shuffle,
    setNextWallpaper: setNextWallpaper,
    setPrevWallpaper: setPrevWallpaper,
    getDuplicatesOfCurrentDir, getDuplicatesOfCurrentDir,
    deleteFiles: deleteFiles
  };
});
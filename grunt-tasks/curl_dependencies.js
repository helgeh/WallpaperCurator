'use strict';

module.exports = function (grunt) {

  grunt.config.merge({
    curl: {
      dev: {
        src: '<%= nwjs.url %>/<%= nwjs.version %>/<%= nwjs.sdkZip %>',
        dest: 'resources/<%= nwjs.sdkZip %>'
      },
      prod: {
        src: '<%= nwjs.url %>/<%= nwjs.version %>/<%= nwjs.zip %>',
        dest: 'resources/<%= nwjs.zip %>'
      }
    },
    unzip: {
      dev: {
        src: 'resources/<%= nwjs.sdkZip %>',
        dest: 'resources/'
      },
      prod: {
        src: 'resources/<%= nwjs.zip %>',
        dest: 'resources/'
      }
    },
    checknwjs: {
      dev: 'sdk',
      prod: ''
    }
  });

  /**
   * Multitask that checks resources folder for dependencies and downloads missing ones.
   * @param string target 'dev' or 'prod'
   */
  grunt.registerMultiTask('checknwjs', 'Make sure we have nwjs dependencies', function() {
    var dir = grunt.config.get('paths.nwjs' + this.data);
    if (!grunt.file.isDir(dir)) {
      var v = grunt.config.get('nwjs.version');
      grunt.log.writeln('');
      grunt.log.warn('OH NO! MISSING DEPENDENCY! \nWE HAVE NO NWJS!');
      grunt.log.writeln('Downloading nwjs ' + v + ' and extracting to \'' + dir + '\'');
      grunt.log.writeln('This may take a while, depending on your internet connection...');
      grunt.task.run(['curl:' + this.target, 'unzip:' + this.target, 'clean:curl']);
    }
  });

};
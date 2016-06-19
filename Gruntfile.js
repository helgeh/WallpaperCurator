'use strict';

var semver = require('semver');

module.exports = function (grunt) {

  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);

  grunt.loadNpmTasks('grunt-curl');
  grunt.loadNpmTasks('grunt-zip');
  grunt.loadNpmTasks('grunt-shell');

  grunt.initConfig({
    pkg: grunt.file.readJSON('app/package.json'),
    nwjs: {
      'url': 'http://dl.nwjs.io',
      'version': 'v0.15.3',
      'sdkZip': 'nwjs-sdk-<%= nwjs.version %>-win-x64.zip',
      'zip': 'nwjs-<%= nwjs.version %>-win-x64.zip'
    },
    paths: {
      'nwjssdkShell': 'resources\\nwjs-sdk-<%= nwjs.version %>-win-x64\\',
      'nwjssdk': 'resources/nwjs-sdk-<%= nwjs.version %>-win-x64',
      'nwjs': 'resources/nwjs-<%= nwjs.version %>-win-x64',
      'tmp': 'tmp',
      'app': 'app',
      'dist': 'dist',
      'resources': 'resources'
    },
    clean: {
      curl: {
        src: 'resources/*.zip'
      }
    },
    copy: {},
    rename: {},
    shell: {
      nwjs: {
        command: 'runme.cmd <%= paths.nwjssdkShell %>'
      }
    }
  });

  grunt.registerTask('bump', 'bump app version', function (type) {
    var packageContent = grunt.config.get('pkg');
    packageContent.version = semver.inc(packageContent.version, type || 'patch');
    grunt.file.write('app/package.json', JSON.stringify(packageContent, null, 2));
    grunt.config.set('pkg', grunt.file.readJSON('package.json'));
    grunt.log.ok('Version bumped to ' + packageContent.version);
  });

  grunt.loadTasks('./grunt-tasks');

  grunt.registerTask('serve', function() {
    grunt.task.run(['checknwjs:dev', 'shell:nwjs']);
  });

  grunt.registerTask('prod', function() {
    grunt.task.run(['checknwjs:prod', 'build:prod']);
  });

  grunt.registerTask('release', function(type) {
    var bump = 'bump' + (type ? ':' + type : '');
    grunt.task.run('checknwjs:prod', bump, 'build:prod');
  });
};
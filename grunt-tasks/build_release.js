'use strict';

module.exports = function (grunt) {

  var paths = grunt.config.get('paths'),
    pkg = grunt.config.get('pkg');

  grunt.config.merge({
    clean: {
      dist: {
        files: [{
          dot: true,
          src: ['<%= paths.dist %>/*', '.build']
        }]
      },
      'build-dir': {
        files: [{
          dot: true,
          src: ['.build/app.nw', '.build/nw.exe']
        }]
      }
    },
    copy: {
      'nwjs': {
        options: {
          mode: true
        },
        files: [
          {
            expand: true,
            cwd: '<%= paths.nwjs %>/',
            dest: '.build',
            src: '**'
          }
        ]
      }
    },
    compress: {
      'app': {
        options: {
          archive: '.build/app.nw',
          mode: 'zip'
        },
        files: [{
          expand: true,
          cwd: '<%= paths.app %>',
          src: ['**']
        }]
      },
      'dist': {
        options: {
          archive: '<%= paths.dist %>/<%= pkg.name %>.zip'
        },
        files: [{
          expand: true,
          cwd: '.build',
          src: ['**']
        }]
      }
    }
  });

  grunt.registerTask('build-app', 'Create windows executable.', function () {
    var done = this.async(),
      concat = require('concat-files');
    concat([
      '.build/nw.exe',
      '.build/app.nw'
    ], '.build/' + pkg.name + '.exe', function (error) {
      if(error){
        grunt.log.error(error);
        done(error);
      }
      done();
    });
  });





  grunt.registerTask('build', function(target) {
    if (target === 'prod') {
      grunt.task.run([
        'clean:dist',
        'copy:nwjs',
        'compress:app',
        'build-app',
        'clean:build-dir',
        'compress:dist'
      ]);
    }
    else {
    }
  });

};

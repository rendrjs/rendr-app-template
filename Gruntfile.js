var path = require('path');

var stylesheetsDir = 'assets/stylesheets';
var rendrDir = 'node_modules/rendr';
var rendrModulesDir = rendrDir + '/node_modules';

module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    bgShell: {
      runNode: {
        cmd: './node_modules/nodemon/nodemon.js index.js',
        bg: true
      }
    },

    stylus: {
      compile: {
        options: {
          paths: [stylesheetsDir],
          'include css': true
        },
        files: {
          'public/styles.css': stylesheetsDir + '/index.styl'
        }
      }
    },

    handlebars: {
      compile: {
        options: {
          namespace: false,
          commonjs: true,
          processName: function(filename) {
            return filename.replace('app/templates/', '').replace('.hbs', '');
          }
        },
        src: "app/templates/*.hbs",
        dest: "app/templates/compiledTemplates.js",
        filter: function(filepath) {
          var filename = path.basename(filepath);
          // Exclude files that begin with '__' from being sent to the client,
          // i.e. __layout.hbs.
          return filename.slice(0, 2) !== '__';
        }
      }
    },

    watch: {
      scripts: {
        files: 'app/**/*.js',
        tasks: ['rendr_stitch'],
        options: {
          interrupt: true
        }
      },
      templates: {
        files: 'app/**/*.hbs',
        tasks: ['handlebars'],
        options: {
          interrupt: true
        }
      },
      stylesheets: {
        files: stylesheetsDir + '/**/*.styl',
        tasks: ['stylus'],
        options: {
          interrupt: true
        }
      }
    },

    rendr_stitch: {
      compile: {
        options: {
          dependencies: [
            rendrDir + '/assets/vendor/**/*.js',
            'assets/vendor/**/*.js',
            rendrModulesDir + '/underscore/underscore.js',
            rendrModulesDir + '/backbone/backbone.js',
            rendrModulesDir + '/async/lib/async.js'
          ],
          aliases: [
            {from: rendrDir + '/client', to: 'rendr/client'},
            {from: rendrDir + '/shared', to: 'rendr/shared'}
          ]
        },
        files: [{
          dest: 'public/mergedAssets.js',
          src: [
            'app/**/*.js',
            rendrDir + '/client/**/*.coffee',
            rendrDir + '/shared/**/*.coffee'
          ]
        }]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-handlebars');
  grunt.loadNpmTasks('grunt-bg-shell');
  grunt.loadNpmTasks('grunt-rendr-stitch');

  grunt.registerTask('compile', ['handlebars', 'rendr_stitch', 'stylus']);

  // Run the server and watch for file changes
  grunt.registerTask('server', ['bgShell:runNode', 'compile', 'watch']);

  // Default task(s).
  grunt.registerTask('default', ['compile']);
};

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json')
  });

  grunt.registerTask('compileTemplates', compileTemplates);
  grunt.registerTask('bundle', bundle);
  grunt.registerTask('buildCss', buildCss);
  grunt.registerTask('createManifest', createManifest);

  grunt.registerTask('compile', ['compileTemplates', 'bundle', 'buildCss', 'createManifest']);

  // Default task(s).
  grunt.registerTask('default', ['compile']);
};


var path = require('path');
var assetCompiler = require('asset-compiler');
var env = require(process.env.PWD + '/config/environments/env');

var rootDir = __dirname;
var appDir = rootDir + '/app';
var templateDir = appDir + '/templates';
var templateFileFilter = '-name *.hbs | grep -v /__*';
var publicDir = rootDir + '/public';
var vendorDir = rootDir + '/assets/vendor';
var stylesheetsDir = rootDir + '/assets/stylesheets';

var modulesDir = rootDir + '/node_modules';
var rendrDir = modulesDir + '/rendr';
var rendrClientDir = rendrDir + '/client';
var rendrSharedDir = rendrDir + '/shared';
var rendrVendorDir = rendrDir + '/assets/vendor';
var rendrModulesDir = rendrDir + '/node_modules';

var manifestLocation = path.normalize(rootDir + '/public/manifest.js');

/**
* Pre-compile handlebar templates.  Resulting compiledTemplates.js file will be stored within
* the template source directory.
*/
function compileTemplates() {
  var done = this.async();
  var options = {
    srcPath: templateDir,
    fileFilter: templateFileFilter,
    destPath: templateDir,
    destFile: 'compiledTemplates.js'
  };
  assetCompiler.compile(options, done);
}


/**
* Package javascript into a single mergedAssets.js file.  (if compileTemplates runs first, compiledTemplates.js
* will be included in this merged file).  Store mergedAssets.js in public dir.
*/
function bundle() {
  var done = this.async();
  var options = {
    // source directories
    src: [
      {type:'src', path:appDir}, // we want all the files in appDir
      {type:'src', path:rendrClientDir, as:'/rendr/client'},  // copy client files to /rendr/client
      {type:'src', path:rendrSharedDir, as:'/rendr/shared'}   // copy shared files to /rendr/shared
    ],
    // specific file dependencies
    depend: [
      {type:'depend', path:rendrVendorDir,  files:['jquery-1.8.2.min.js',
                                                   'handlebars-runtime-1.0.rc.1.js']},
      {type:'depend', path:rendrModulesDir, files:['/underscore/underscore.js',
                                                   '/backbone/backbone.js',
                                                   '/async/lib/async.js']},

      {type:'depend', path:vendorDir, files:'all'}
    ],
    // where the newly created packaged file will go
    destPath: publicDir,
    destFile: 'mergedAssets.js'
  };
  assetCompiler.bundle(options, done);
}


function buildCss() {
  var done = this.async();
  var minify = (env.current.assets && env.current.assets.minify === true);
  var options = {
    stylusPath: stylesheetsDir + '/index.styl',
    cssOutputFile: publicDir + '/styles.css',
    stylesheets: stylesheetsDir,
    minify: minify
  };
  assetCompiler.createCss(options, done);
}


function createManifest() {
  var done = this.async();
  // create manifist file
  var manifest = {};
  ['mergedAssets.js', 'styles.css'].forEach(function(name) {
    manifest[name] = '/' + name;
  });
  var body = "// Created at " + new Date().toString();
  body += "\nmodule.exports = " + JSON.stringify(manifest);
  body += "\n";
  assetCompiler.fse.writeFile(manifestLocation, body, function (err) {
    if (err) return done(err);
    console.log("Created " + manifestLocation);
    done();
  });
}

var path = require('path');
var assetCompiler = require('asset-compiler');
var async = require('async');
var _ = require('underscore');
var env = require(process.env.PWD + '/config/environments/env');

var mowebRootDir = __dirname + '/../..';
var appDir = mowebRootDir + '/app';
var templateDir = appDir + '/templates';
var templateFileFilter = '-name *.hbs | grep -v /__*';
var publicDir = mowebRootDir + '/public';
var vendorDir = mowebRootDir + '/assets/vendor';
var stylesheetsDir = mowebRootDir + '/assets/stylesheets';

var modulesDir = mowebRootDir + '/node_modules';
var rendrDir = modulesDir + '/rendr';
var rendrClientDir = rendrDir + '/client';
var rendrSharedDir = rendrDir + '/shared';
var rendrVendorDir = rendrDir + '/assets/vendor';
var rendrModulesDir = rendrDir + '/node_modules';

var manifestLocation = path.normalize(mowebRootDir + '/public/manifest.js');
var generatedFiles = [
  templateDir + '/compiledTemplates.js',
  publicDir + '/mergedAssets.js',
  publicDir + '/styles.css',
  mowebRootDir + '/static',
  manifestLocation
];


/**
* Return true if any generated files are missing
*/
exports.missing = function() {
  var allFilesExist = true;
  generatedFiles.forEach(function(file) {
    if (!assetCompiler.fse.existsSync(file)) {
      allFilesExist = false;
    }
  });
  return !allFilesExist;
};


/**
* Remove generated files
*/
exports.clean = clean = function() {
  generatedFiles.forEach(function(file) {
    console.log("remove " + file);
    assetCompiler.fse.remove(file);
  });
};


/**
*  It is important to init the assetCompiler to get fingerprinting and asset-url's right
*/
function initCdn(cb) {
  var options = _.clone(env.current.assets) || {};
  if (options && options.fingerprint) {
    options.fingerprint.sourcePath = publicDir;
    options.fingerprint.destinationPath = mowebRootDir + '/static';
  }
  assetCompiler.init(options, cb);
}


/**
* Pre-compile handlebar templates.  Resulting compiledTemplates.js file will be stored within
* the template source directory.
*/
function compileTemplates(cb) {
  var options = {
    srcPath: templateDir,
    fileFilter: templateFileFilter,
    destPath: templateDir,
    destFile: 'compiledTemplates.js'
  };
  assetCompiler.compile(options, cb);
}


/**
* Package javascript into a single mergedAssets.js file.  (if compileTemplates runs first, compiledTemplates.js
* will be included in this merged file).  Store mergedAssets.js in public dir.
*/
function bundle(cb) {
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
  assetCompiler.bundle(options, cb);
}


/**
*  Build public/styles.css -- be sure to correctly reference fingerprinted assets -- depends on init
*/
function buildCss(cb) {
  var minify = (env.current.assets && env.current.assets.minify === true);
  var options = {
    stylusPath: stylesheetsDir + '/index.styl',
    cssOutputFile: publicDir + '/styles.css',
    stylesheets: stylesheetsDir,
    minify: minify
  };
  assetCompiler.createCss(options, cb);
}


/**
*  Fingerprint the contents of config.sourcePath (ie: /public) into config.destinationPath (ie: /static)
*  It is important that these match the config of when the styles.css file was made (via buildCss)
*/
function fingerprint(cb) {
  var config = env.current.assets.fingerprint;
  assetCompiler.fingerprintAssets(config.sourcePath, config.destinationPath, function(err, results) {
    if (err) return cb(err);
    console.log("Fingerprinted " + config.destinationPath);
    return cb();
  });
}

function createManifest(cb) {
  // create manifist file
  var manifest = {};
  ['mergedAssets.js', 'styles.css'].forEach(function(name) {
    manifest[name] = assetCompiler.assetUrl(name);
  });
  var body = "// Created at " + new Date().toString();
  body += "\nmodule.exports = " + JSON.stringify(manifest);
  body += "\n";
  assetCompiler.fse.writeFile(manifestLocation, body, function (err) {
    if (err) return cb(err);
    console.log("Created " + manifestLocation);
    return cb();
  });
}


/**
*  The run script that defines command ordering
*/
exports.compile = function(flags, callback) {
  if (arguments.length == 1) {
    // flags was not passed in
    callback = arguments[0];
    flags = null;
  }
  if (flags) {
    console.log("CompileAssets with these flags: ", flags);
  }
  var commands = [];
  // compile templates and bundle all js into mergedAssets.js
  if (!flags || flags.compileTemplates) {
    commands.push(compileTemplates);
  }
  if (!flags || flags.bundle) {
    commands.push(bundle);
  }
  // stamp assets, create styles.css that correctly references those assets
  if (!flags || flags.initCdn) {
    commands.push(initCdn);
  }
  if (!flags || flags.buildCss) {
    commands.push(buildCss);
  }
  if (!flags || flags.fingerprint) {
    commands.push(fingerprint);
  }
  if (!flags || flags.createManifest) {
    commands.push(createManifest);
  }

  async.series(commands, function(err) {
    if (err) {
      console.log("COMPILE ASSETS ERROR: ", err);
    }
    return callback(err);
  });
};


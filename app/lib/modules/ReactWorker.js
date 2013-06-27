/**
 * @providesModule ReactWorker
 */

// evalInUI(), evalInWorker(), main()
// initial mount from worker
// listen for events
// whitelist some non-worker event handlers?

var ExecutionEnvironment = require("./ExecutionEnvironment");
var emptyFunction = require("./emptyFunction");

var supportsWorkers = typeof Worker !== 'undefined';
var worker = null;

var callbackIDs = 0;
var callbacks = {};

function registerCallback(cb) {
  // TODO: cleanup?
  var key = 'cb' + (callbackIDs++);
  callbacks[key] = cb;
  return key;
}

function evalInUI(expr, cb) {
  cb = cb || emptyFunction;

  if (ExecutionEnvironment.canUseDOM) {
    // TODO: setTimeout()?
    cb(eval(expr));
    return;
  }
  self.postMessage(['eval', expr, registerCallback(cb)]);
}

function evalInWorker(expr, cb) {
  cb = cb || emptyFunction;

  if (!ExecutionEnvironment.canUseDOM || !worker) {
    // TODO: setTimeout()?
    cb(eval(expr));
    return;
  }
  worker.postMessage(['eval', expr, registerCallback(cb)]);
}

function handleMessage(msg, reply) {
  if (msg[0] === 'eval') {
    reply(['cb', msg[2], eval(msg[1])]);
  } else if (msg[0] === 'cb') {
    callbacks[msg[1]](msg[2]);
    delete callbacks[msg[1]];
  }
}

function init(path) {
  worker = new Worker(path);
  worker.onmessage = function(event) {
    console.log(event);
    handleMessage(event.data, worker.postMessage);
  };
  worker.onerror = function(event) {
    console.log(event);
  };
}

function workerMain() {
  // webworker main
  self.onmessage = function(event) {
    handleMessage(event.data, self.postMessage);
  };
  evalInUI('console.log("hello");');
}

if (ExecutionEnvironment.isInWorker) {
  // we are being used a a webworker
  workerMain();
}

module.exports = {
  supportsWorkers: supportsWorkers,
  evalInUI: evalInUI,
  evalInWorker: evalInWorker,
  init: init
};


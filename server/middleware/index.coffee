fs = require('fs')
path = require('path')

fs.readdirSync(__dirname).forEach (filename) ->
  name = path.basename(filename, '.coffee')
  return if name is 'index' or name[0] is '_'
  load = -> require("./#{name}")
  exports.__defineGetter__(name, load)

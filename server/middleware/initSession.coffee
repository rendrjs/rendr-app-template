express = require('express')

module.exports = ->
  express.session({
    secret: '<your secret here>'
  })


var express = require('express')
  , router = express.Router()

  

  router.use('/search', require('./search_route'))
  router.use('/book', require('./book_route'))

  module.exports = router
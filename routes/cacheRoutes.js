const express = require('express');
const cacheController = require('../controller/cacheController')

const router = express.Router()

router.get('/cachePhotos', cacheController.cache)
router.get('/clearCachePhotos', cacheController.clearCache)

module.exports = router
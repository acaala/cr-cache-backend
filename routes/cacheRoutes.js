const express = require('express');
const cacheController = require('../controller/cacheController')
const crController = require('../controller/crController')
const router = express.Router()

router.get('/cr-home', crController.fetchPage)
router.get('/cr-home-clear', crController.clearPage)
router.get('/cr-prices', crController.fetchPage)
router.get('/cr-prices-clear', crController.clearPage)

router.get('/flushAll', crController.flushAll)

router.get('/cachePhotos', cacheController.cache);
router.get('/clearCachePhotos', cacheController.clearCache);

router.get('/cachePosts', cacheController.cache);
router.get('/clearCachePosts', cacheController.clearCache);

module.exports = router
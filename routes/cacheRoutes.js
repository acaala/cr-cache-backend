const express = require('express');
const crController = require('../controller/crController')
const dbController = require('../controller/dbController')
const router = express.Router()

router.get('/cr-home', crController.fetchPage)
router.get('/cr-home-clear', crController.clearPage)

router.get('/cr-prices', crController.fetchPage)
router.get('/cr-prices-clear', crController.clearPage)

router.get('/cr-news', crController.fetchPage)
router.get('/cr-news-clear', crController.clearPage)

router.get('/cr-nft', crController.fetchPage)
router.get('/cr-nft-clear', crController.clearPage)

router.get('/cr-support', crController.fetchPage)
router.get('/cr-support-clear', crController.clearPage)

router.get('/flushAll', dbController.flushAll)

router.get('/js-main', crController.fetchJS)
router.get('/js-main-info', crController.fetchJSInfo)
router.get('/js-main-clear', crController.clearJS)

router.get('/js-landing', crController.fetchJS)
router.get('/js-landing-info', crController.fetchJSInfo)
router.get('/js-landing-clear', crController.clearJS)

router.get('/js-prices', crController.fetchJS)
router.get('/js-prices-info', crController.fetchJSInfo)
router.get('/js-prices-clear', crController.clearJS)



module.exports = router
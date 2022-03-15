const express = require('express');
const crController = require('../controller/crController')
const router = express.Router()

router.get('/cr-home', crController.fetchPage)
router.get('/cr-home-clear', crController.clearPage)
router.get('/cr-prices', crController.fetchPage)
router.get('/cr-prices-clear', crController.clearPage)

router.get('/flushAll', crController.flushAll)

module.exports = router
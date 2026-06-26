const express = require('express')
const router = express.Router()
const { getOrganizations, checkFlag } = require('../controllers/user.controller')

router.get('/organizations', getOrganizations)
router.post('/check-flag', checkFlag)

module.exports = router
const express = require('express')
const router = express.Router()
const { login, createOrganization, getOrganizations } = require('../controllers/superadmin.controller')
const { protect, authorizeRoles } = require('../middleware/auth')

router.post('/login', login)
router.post('/organizations', protect, authorizeRoles('super_admin'), createOrganization)
router.get('/organizations', protect, authorizeRoles('super_admin'), getOrganizations)

module.exports = router
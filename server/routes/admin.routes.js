const express = require('express')
const router = express.Router()
const { signup, login, getFlags, createFlag, updateFlag, deleteFlag } = require('../controllers/admin.controller')
const { protect, authorizeRoles } = require('../middleware/auth')

router.post('/signup', signup)
router.post('/login', login)

router.get('/flags', protect, authorizeRoles('org_admin'), getFlags)
router.post('/flags', protect, authorizeRoles('org_admin'), createFlag)
router.put('/flags/:id', protect, authorizeRoles('org_admin'), updateFlag)
router.delete('/flags/:id', protect, authorizeRoles('org_admin'), deleteFlag)

module.exports = router
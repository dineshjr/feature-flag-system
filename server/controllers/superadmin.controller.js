const jwt = require('jsonwebtoken')
const Organization = require('../models/Organization')
const SUPER_ADMIN = require('../config/superadmin')

const login = (req, res) => {
  const { email, password } = req.body

  if (email !== SUPER_ADMIN.email || password !== SUPER_ADMIN.password) {
    return res.status(401).json({ message: 'Invalid credentials' })
  }

  const token = jwt.sign(
    { email: SUPER_ADMIN.email, role: 'super_admin' },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  )

  res.json({ token, role: 'super_admin', email: SUPER_ADMIN.email })
}

const createOrganization = async (req, res) => {
  const { name } = req.body

  if (!name) return res.status(400).json({ message: 'Organization name is required' })

  try {
    const org = await Organization.create({ name })
    res.status(201).json(org)
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Organization name already exists' })
    }
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

const getOrganizations = async (req, res) => {
  try {
    const orgs = await Organization.find().sort({ createdAt: -1 })
    res.json(orgs)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

module.exports = { login, createOrganization, getOrganizations }
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const Organization = require('../models/Organization')
const FeatureFlag = require('../models/FeatureFlag')

const signup = async (req, res) => {
  const { email, password, orgId } = req.body

  if (!email || !password || !orgId) {
    return res.status(400).json({ message: 'email, password and orgId are required' })
  }

  try {
    const orgExists = await Organization.findById(orgId)
    if (!orgExists) return res.status(404).json({ message: 'Organization not found' })

    const userExists = await User.findOne({ email })
    if (userExists) return res.status(409).json({ message: 'Email already registered' })

    const user = await User.create({ email, password, orgId, role: 'org_admin' })
    res.status(201).json({ message: 'Admin registered successfully', userId: user._id })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

const login = async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await User.findOne({ email }).populate('orgId', 'name')
    if (!user) return res.status(401).json({ message: 'Invalid credentials' })

    const isMatch = await user.matchPassword(password)
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' })

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role, orgId: user.orgId._id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    )

    res.json({
      token,
      role: user.role,
      email: user.email,
      orgId: user.orgId._id,
      orgName: user.orgId.name,
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

const getFlags = async (req, res) => {
  try {
    const flags = await FeatureFlag.find({ orgId: req.user.orgId }).sort({ createdAt: -1 })
    res.json(flags)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

const createFlag = async (req, res) => {
  const { key, enabled } = req.body

  if (!key) return res.status(400).json({ message: 'Feature key is required' })

  try {
    const flag = await FeatureFlag.create({
      key: key.trim().toLowerCase(),
      enabled: enabled ?? false,
      orgId: req.user.orgId,
    })
    res.status(201).json(flag)
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Feature key already exists for this org' })
    }
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

const updateFlag = async (req, res) => {
  const { enabled } = req.body

  try {
    const flag = await FeatureFlag.findOneAndUpdate(
      { _id: req.params.id, orgId: req.user.orgId },
      { enabled },
      { new: true }
    )
    if (!flag) return res.status(404).json({ message: 'Flag not found' })
    res.json(flag)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

const deleteFlag = async (req, res) => {
  try {
    const flag = await FeatureFlag.findOneAndDelete({
      _id: req.params.id,
      orgId: req.user.orgId,
    })
    if (!flag) return res.status(404).json({ message: 'Flag not found' })
    res.json({ message: 'Flag deleted' })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

module.exports = { signup, login, getFlags, createFlag, updateFlag, deleteFlag }
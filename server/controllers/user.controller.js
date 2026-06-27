const FeatureFlag = require('../models/FeatureFlag')
const Organization = require('../models/Organizations')

const getOrganizations = async (req, res) => {
  try {
    const orgs = await Organization.find({}, '_id name').sort({ name: 1 }).lean()
    console.log('orgs:', orgs) // check server terminal
    res.json(orgs)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

const checkFlag = async (req, res) => {
  const { orgId, featureKey } = req.body

  if (!orgId || !featureKey) {
    return res.status(400).json({ message: 'orgId and featureKey are required' })
  }

  try {
    const flag = await FeatureFlag.findOne({
      orgId,
      key: featureKey.trim().toLowerCase(),
    })

    if (!flag) {
      return res.status(404).json({ message: 'Feature flag not found for this organization' })
    }

    res.json({ key: flag.key, enabled: flag.enabled })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

module.exports = { getOrganizations, checkFlag }
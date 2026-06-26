const express = require('express')
const cors = require('cors')
require('dotenv').config()

const superadminRoutes = require('./routes/superadmin.routes')
const adminRoutes = require('./routes/admin.routes')
const userRoutes = require('./routes/user.routes')

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/superadmin', superadminRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/user', userRoutes)

app.get('/', (req, res) => res.json({ message: 'Feature Flag API running' }))

module.exports = app
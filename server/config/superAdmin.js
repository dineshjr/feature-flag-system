const SUPER_ADMIN = {
  email: process.env.SUPER_ADMIN_EMAIL || 'superadmin@byepo.com',
  password: process.env.SUPER_ADMIN_PASSWORD || 'superadmin123',
  role: 'super_admin',
}

module.exports = SUPER_ADMIN
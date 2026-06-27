import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router'
import axios from 'axios'

export default function Signup() {
  const navigate = useNavigate()
  const [orgs, setOrgs] = useState([])
  const [form, setForm] = useState({ email: '', password: '', orgId: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

useEffect(() => {
  const fetchOrgs = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/user/organizations')
      console.log('orgs response:', res.data)
      setOrgs(Array.isArray(res.data) ? res.data : [])
    } catch (err) {
      console.error('org fetch error:', err)
      setError('Failed to load organizations')
      setOrgs([])
    }
  }
  fetchOrgs()
}, [])

const handleSubmit = async (e) => {
  e.preventDefault()
  setError('')
  setSuccess('')

  if (!form.email || !form.password || !form.orgId) {
    return setError('All fields are required')
  }

  setLoading(true)
  try {
    await axios.post('http://localhost:5000/api/admin/signup', form)
    setSuccess('Account created! Redirecting to login...')
    setTimeout(() => navigate('/'), 1500)
  } catch (err) {
    setError(err.response?.data?.message || 'Signup failed')
  } finally {
    setLoading(false)
  }
}

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Admin Signup</h2>
        <p style={styles.subtitle}>Create your organization admin account</p>

        {error && <p style={styles.error}>{error}</p>}
        {success && <p style={styles.success}>{success}</p>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>Email</label>
          <input
            style={styles.input}
            type="email"
            placeholder="admin@company.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />

          <label style={styles.label}>Password</label>
          <input
            style={styles.input}
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />

          <label style={styles.label}>Organization</label>
          <select
            style={styles.input}
            value={form.orgId}
            onChange={(e) => setForm({ ...form, orgId: e.target.value })}
            required
          >
            <option value="">-- Select Organization --</option>
            {orgs.map((org) => (
              <option key={org._id} value={org._id}>{org.name}</option>
            ))}
          </select>

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <p style={styles.link}>
          Already have an account? <Link to="/">Login</Link>
        </p>
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f2f5',
  },
  card: {
    backgroundColor: '#fff',
    padding: '40px',
    borderRadius: '10px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '420px',
  },
  title: { margin: 0, fontSize: '22px', color: '#111' },
  subtitle: { marginTop: '4px', color: '#888', fontSize: '13px' },
  error: { color: 'red', fontSize: '13px', marginBottom: '10px' },
  success: { color: 'green', fontSize: '13px', marginBottom: '10px' },
  form: { display: 'flex', flexDirection: 'column', marginTop: '20px' },
  label: { fontSize: '13px', color: '#555', marginBottom: '4px' },
  input: {
    padding: '10px 12px',
    marginBottom: '16px',
    borderRadius: '6px',
    border: '1px solid #ddd',
    fontSize: '14px',
    outline: 'none',
    backgroundColor: '#fff',
  },
  button: {
    padding: '11px',
    backgroundColor: '#111',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    cursor: 'pointer',
    marginTop: '4px',
  },
  link: { textAlign: 'center', marginTop: '16px', fontSize: '13px', color: '#555' },
}
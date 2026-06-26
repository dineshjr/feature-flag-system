import { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import { useAuth } from '../context/AuthContext'

const MOCK_ADMIN = {
  email: 'admin@acme.com',
  password: 'admin123',
  orgId: '1',
  orgName: 'Acme Corp',
}

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (form.email === MOCK_ADMIN.email && form.password === MOCK_ADMIN.password) {
      login('mock-token-admin', {
        email: MOCK_ADMIN.email,
        role: 'org_admin',
        orgId: MOCK_ADMIN.orgId,
        orgName: MOCK_ADMIN.orgName,
      })
      navigate('/dashboard')
    } else {
      setError('Invalid credentials')
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Admin Login</h2>
        <p style={styles.subtitle}>Organization Admin Portal</p>

        {error && <p style={styles.error}>{error}</p>}

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

          <button type="submit" style={styles.button}>Login</button>
        </form>

        <p style={styles.link}>
          Don't have an account? <Link to="/signup">Sign Up</Link>
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
    maxWidth: '400px',
  },
  title: { margin: 0, fontSize: '22px', color: '#111' },
  subtitle: { marginTop: '4px', color: '#888', fontSize: '13px' },
  error: { color: 'red', fontSize: '13px', marginBottom: '10px' },
  form: { display: 'flex', flexDirection: 'column', marginTop: '20px' },
  label: { fontSize: '13px', color: '#555', marginBottom: '4px' },
  input: {
    padding: '10px 12px',
    marginBottom: '16px',
    borderRadius: '6px',
    border: '1px solid #ddd',
    fontSize: '14px',
    outline: 'none',
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
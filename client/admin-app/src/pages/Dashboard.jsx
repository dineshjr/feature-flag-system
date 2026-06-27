import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '../context/AuthContext'
import api from '../api/axiosInstance'

export default function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [flags, setFlags] = useState([])
  const [newKey, setNewKey] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    fetchFlags()
  }, [])

  const fetchFlags = async () => {
    setLoading(true)
    try {
      const res = await api.get('/flags')
      setFlags(res.data)
    } catch (err) {
      setError('Failed to load feature flags')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    const trimmed = newKey.trim().toLowerCase()
    if (!trimmed) return setError('Feature key is required')

    setCreating(true)
    try {
      const res = await api.post('/flags', { key: trimmed, enabled: false })
      setFlags([res.data, ...flags])
      setNewKey('')
      setSuccess(`"${trimmed}" created`)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create flag')
    } finally {
      setCreating(false)
    }
  }

  const handleToggle = async (flag) => {
    try {
      const res = await api.put(`/flags/${flag._id}`, { enabled: !flag.enabled })
      setFlags(flags.map((f) => f._id === flag._id ? res.data : f))
    } catch (err) {
      setError('Failed to update flag')
    }
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/flags/${id}`)
      setFlags(flags.filter((f) => f._id !== id))
    } catch (err) {
      setError('Failed to delete flag')
    }
  }

  return (
    <div style={styles.container}>

      {/* Header */}
      <div style={styles.header}>
        <div>
          <h2 style={styles.headerTitle}>Admin Dashboard</h2>
          <span style={styles.orgBadge}>{user?.orgName}</span>
        </div>
        <div style={styles.headerRight}>
          <span style={styles.emailBadge}>{user?.email}</span>
          <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
        </div>
      </div>

      <div style={styles.body}>

        {/* Create Flag */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Create Feature Flag</h3>
          <form onSubmit={handleCreate} style={styles.inlineForm}>
            <input
              style={styles.input}
              type="text"
              placeholder="e.g. dark_mode, beta_dashboard"
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
            />
            <button type="submit" style={styles.createBtn} disabled={creating}>
              {creating ? 'Creating...' : 'Create'}
            </button>
          </form>
          {error && <p style={styles.error}>{error}</p>}
          {success && <p style={styles.success}>{success}</p>}
        </div>

        {/* Flags List */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Feature Flags ({flags.length})</h3>

          {loading ? (
            <p style={styles.empty}>Loading...</p>
          ) : flags.length === 0 ? (
            <p style={styles.empty}>No feature flags yet.</p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Key</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Toggle</th>
                  <th style={styles.th}>Delete</th>
                </tr>
              </thead>
              <tbody>
                {flags.map((flag, index) => (
                  <tr key={flag._id} style={index % 2 === 0 ? styles.rowEven : styles.rowOdd}>
                    <td style={styles.td}>
                      <code style={styles.code}>{flag.key}</code>
                    </td>
                    <td style={styles.td}>
                      <span style={flag.enabled ? styles.badgeOn : styles.badgeOff}>
                        {flag.enabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <button
                        onClick={() => handleToggle(flag)}
                        style={flag.enabled ? styles.disableBtn : styles.enableBtn}
                      >
                        {flag.enabled ? 'Disable' : 'Enable'}
                      </button>
                    </td>
                    <td style={styles.td}>
                      <button onClick={() => handleDelete(flag._id)} style={styles.deleteBtn}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </div>
  )
}

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#f0f2f5', fontFamily: 'sans-serif' },
  header: {
    backgroundColor: '#111',
    color: '#fff',
    padding: '16px 32px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: { margin: 0, fontSize: '18px' },
  orgBadge: { fontSize: '12px', color: '#facc15', marginTop: '4px' },
  headerRight: { display: 'flex', alignItems: 'center', gap: '12px' },
  emailBadge: { fontSize: '13px', color: '#aaa' },
  logoutBtn: {
    padding: '7px 16px',
    backgroundColor: '#e53e3e',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '13px',
  },
  body: { padding: '32px', maxWidth: '800px', margin: '0 auto' },
  card: {
    backgroundColor: '#fff',
    borderRadius: '10px',
    padding: '24px',
    marginBottom: '24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
  },
  cardTitle: { margin: '0 0 16px', fontSize: '16px', color: '#111' },
  inlineForm: { display: 'flex', gap: '10px' },
  input: {
    flex: 1,
    padding: '10px 12px',
    borderRadius: '6px',
    border: '1px solid #ddd',
    fontSize: '14px',
    outline: 'none',
  },
  createBtn: {
    padding: '10px 20px',
    backgroundColor: '#111',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  error: { color: 'red', fontSize: '13px', marginTop: '10px' },
  success: { color: 'green', fontSize: '13px', marginTop: '10px' },
  empty: { color: '#888', fontSize: '14px' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: {
    textAlign: 'left',
    padding: '10px 12px',
    fontSize: '13px',
    color: '#555',
    borderBottom: '2px solid #eee',
  },
  td: { padding: '10px 12px', fontSize: '14px', color: '#333' },
  rowEven: { backgroundColor: '#fff' },
  rowOdd: { backgroundColor: '#fafafa' },
  code: { backgroundColor: '#f4f4f4', padding: '2px 6px', borderRadius: '4px', fontSize: '13px' },
  badgeOn: {
    backgroundColor: '#d1fae5', color: '#065f46',
    padding: '3px 10px', borderRadius: '20px', fontSize: '12px',
  },
  badgeOff: {
    backgroundColor: '#fee2e2', color: '#991b1b',
    padding: '3px 10px', borderRadius: '20px', fontSize: '12px',
  },
  enableBtn: {
    padding: '5px 12px', backgroundColor: '#22c55e', color: '#fff',
    border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '12px',
  },
  disableBtn: {
    padding: '5px 12px', backgroundColor: '#f59e0b', color: '#fff',
    border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '12px',
  },
  deleteBtn: {
    padding: '5px 12px', backgroundColor: '#e53e3e', color: '#fff',
    border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '12px',
  },
}
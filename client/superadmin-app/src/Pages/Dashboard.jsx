import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '../context/AuthContext'
import api from '../api/axiosInstance'

export default function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [orgs, setOrgs] = useState([])
  const [orgName, setOrgName] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)

  // Fetch orgs on mount
  useEffect(() => {
    fetchOrgs()
  }, [])

  const fetchOrgs = async () => {
    setLoading(true)
    try {
      const res = await api.get('/organizations')
      setOrgs(res.data)
    } catch (err) {
      setError('Failed to load organizations')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const handleCreateOrg = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    const trimmed = orgName.trim()
    if (!trimmed) return setError('Organization name is required')

    setCreating(true)
    try {
      const res = await api.post('/organizations', { name: trimmed })
      setOrgs([res.data, ...orgs])
      setOrgName('')
      setSuccess(`"${trimmed}" created successfully`)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create organization')
    } finally {
      setCreating(false)
    }
  }

  return (
    <div style={styles.container}>

      {/* Header */}
      <div style={styles.header}>
        <h2 style={styles.headerTitle}>Super Admin Dashboard</h2>
        <div style={styles.headerRight}>
          <span style={styles.emailBadge}>{user?.email}</span>
          <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
        </div>
      </div>

      <div style={styles.body}>

        {/* Create Org */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Create Organization</h3>
          <form onSubmit={handleCreateOrg} style={styles.inlineForm}>
            <input
              style={styles.input}
              type="text"
              placeholder="Organization name"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
            />
            <button type="submit" style={styles.createBtn} disabled={creating}>
              {creating ? 'Creating...' : 'Create'}
            </button>
          </form>
          {error && <p style={styles.error}>{error}</p>}
          {success && <p style={styles.success}>{success}</p>}
        </div>

        {/* Org List */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Organizations ({orgs.length})</h3>

          {loading ? (
            <p style={styles.empty}>Loading...</p>
          ) : orgs.length === 0 ? (
            <p style={styles.empty}>No organizations yet.</p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>#</th>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Created At</th>
                </tr>
              </thead>
              <tbody>
                {orgs.map((org, index) => (
                  <tr key={org._id} style={index % 2 === 0 ? styles.rowEven : styles.rowOdd}>
                    <td style={styles.td}>{index + 1}</td>
                    <td style={styles.td}>{org.name}</td>
                    <td style={styles.td}>{new Date(org.createdAt).toLocaleDateString()}</td>
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
}
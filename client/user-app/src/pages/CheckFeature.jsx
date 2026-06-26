import { useState } from 'react'

const MOCK_ORGS = [
    { _id: '1', name: 'Acme Corp' },
    { _id: '2', name: 'Stark Industries' },
    { _id: '3', name: 'Wayne Enterprises' },
]

const MOCK_FLAGS = {
    '1': [
        { key: 'dark_mode', enabled: true },
        { key: 'beta_dashboard', enabled: false },
        { key: 'new_checkout', enabled: true },
    ],
    '2': [
        { key: 'ai_search', enabled: true },
        { key: 'dark_mode', enabled: false },
    ],
    '3': [
        { key: 'new_checkout', enabled: false },
        { key: 'beta_dashboard', enabled: true },
    ],
}

export default function CheckFeature() {
    const [orgId, setOrgId] = useState('')
    const [featureKey, setFeatureKey] = useState('')
    const [result, setResult] = useState(null) // { key, enabled } | 'not_found'
    const [error, setError] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        setResult(null)
        setError('')

        if (!orgId) return setError('Please select an organization')
        if (!featureKey.trim()) return setError('Please enter a feature key')

        const orgFlags = MOCK_FLAGS[orgId] || []
        const found = orgFlags.find(
            (f) => f.key === featureKey.trim().toLowerCase()
        )

        if (!found) {
            setResult('not_found')
        } else {
            setResult(found)
        }
    }

    const handleReset = () => {
        setOrgId('')
        setFeatureKey('')
        setResult(null)
        setError('')
    }

    return (
        <div style={styles.container}>
            <div style={styles.card}>

                {/* Header */}
                <div style={styles.header}>
                    <h2 style={styles.title}>Feature Flag Checker</h2>
                    <p style={styles.subtitle}>Check if a feature is enabled for your organization</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} style={styles.form}>
                    <label style={styles.label}>Organization</label>
                    <select
                        style={styles.input}
                        value={orgId}
                        onChange={(e) => { setOrgId(e.target.value); setResult(null) }}
                    >
                        <option value="">-- Select Organization --</option>
                        {MOCK_ORGS.map((org) => (
                            <option key={org._id} value={org._id}>{org.name}</option>
                        ))}
                    </select>

                    <label style={styles.label}>Feature Key</label>
                    <input
                        style={styles.input}
                        type="text"
                        placeholder="e.g. dark_mode, new_checkout"
                        value={featureKey}
                        onChange={(e) => { setFeatureKey(e.target.value); setResult(null) }}
                    />

                    {error && <p style={styles.error}>{error}</p>}

                    <div style={styles.btnRow}>
                        <button type="submit" style={styles.checkBtn}>Check</button>
                        {result !== null && (
                            <button type="button" onClick={handleReset} style={styles.resetBtn}>
                                Reset
                            </button>
                        )}
                    </div>
                </form>

                {/* Result */}
                {result !== null && (
                    <div style={result === 'not_found' ? styles.resultNotFound : result.enabled ? styles.resultEnabled : styles.resultDisabled}>
                        {result === 'not_found' ? (
                            <>
                                <span style={styles.resultIcon}>🔍</span>
                                <div>
                                    <p style={styles.resultTitle}>Flag Not Found</p>
                                    <p style={styles.resultSub}>
                                        <code style={styles.code}>{featureKey}</code> does not exist for this organization
                                    </p>
                                </div>
                            </>
                        ) : (
                            <>
                                <span style={styles.resultIcon}>{result.enabled ? '✅' : '❌'}</span>
                                <div>
                                    <p style={styles.resultTitle}>
                                        {result.enabled ? 'Feature is Enabled' : 'Feature is Disabled'}
                                    </p>
                                    <p style={styles.resultSub}>
                                        <code style={styles.code}>{result.key}</code> is currently{' '}
                                        <strong>{result.enabled ? 'ON' : 'OFF'}</strong> for{' '}
                                        {MOCK_ORGS.find((o) => o._id === orgId)?.name}
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                )}

                {/* Hint */}
                <div style={styles.hint}>
                    <p style={styles.hintTitle}>Available test flags</p>
                    <div style={styles.hintGrid}>
                        {MOCK_ORGS.map((org) => (
                            <div key={org._id} style={styles.hintCard}>
                                <p style={styles.hintOrg}>{org.name}</p>
                                {(MOCK_FLAGS[org._id] || []).map((f) => (
                                    <div key={f.key} style={styles.hintRow}>
                                        <code style={styles.code}>{f.key}</code>
                                        <span style={f.enabled ? styles.dotOn : styles.dotOff}>
                                            {f.enabled ? 'ON' : 'OFF'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    )
}

const styles = {
    container: {
        minHeight: '100vh',
        backgroundColor: '#f0f2f5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        fontFamily: 'sans-serif',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: '12px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '520px',
        overflow: 'hidden',
    },
    header: {
        backgroundColor: '#111',
        padding: '24px 32px',
        color: '#fff',
    },
    title: { margin: 0, fontSize: '20px' },
    subtitle: { margin: '6px 0 0', fontSize: '13px', color: '#aaa' },
    form: {
        padding: '24px 32px',
        display: 'flex',
        flexDirection: 'column',
    },
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
    error: { color: 'red', fontSize: '13px', marginBottom: '10px' },
    btnRow: { display: 'flex', gap: '10px' },
    checkBtn: {
        flex: 1,
        padding: '11px',
        backgroundColor: '#111',
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
        fontSize: '14px',
        cursor: 'pointer',
    },
    resetBtn: {
        padding: '11px 20px',
        backgroundColor: '#f0f2f5',
        color: '#555',
        border: '1px solid #ddd',
        borderRadius: '6px',
        fontSize: '14px',
        cursor: 'pointer',
    },
    resultEnabled: {
        margin: '0 32px 24px',
        padding: '16px',
        backgroundColor: '#d1fae5',
        borderRadius: '8px',
        border: '1px solid #6ee7b7',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
    },
    resultDisabled: {
        margin: '0 32px 24px',
        padding: '16px',
        backgroundColor: '#fee2e2',
        borderRadius: '8px',
        border: '1px solid #fca5a5',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
    },
    resultNotFound: {
        margin: '0 32px 24px',
        padding: '16px',
        backgroundColor: '#fef9c3',
        borderRadius: '8px',
        border: '1px solid #fde047',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
    },
    resultIcon: { fontSize: '22px' },
    resultTitle: { margin: 0, fontWeight: '600', fontSize: '14px', color: '#111' },
    resultSub: { margin: '4px 0 0', fontSize: '13px', color: '#444' },
    code: {
        backgroundColor: '#f4f4f4',
        padding: '2px 6px',
        borderRadius: '4px',
        fontSize: '12px',
        fontFamily: 'monospace',
    },
    hint: {
        padding: '20px 32px 28px',
        borderTop: '1px solid #eee',
        backgroundColor: '#fafafa',
    },
    hintTitle: { margin: '0 0 12px', fontSize: '12px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px' },
    hintGrid: { display: 'flex', flexDirection: 'column', gap: '12px' },
    hintCard: { display: 'flex', flexDirection: 'column', gap: '4px' },
    hintOrg: { margin: 0, fontSize: '12px', fontWeight: '600', color: '#555' },
    hintRow: { display: 'flex', alignItems: 'center', gap: '8px' },
    dotOn: { fontSize: '11px', color: '#065f46', backgroundColor: '#d1fae5', padding: '1px 6px', borderRadius: '10px' },
    dotOff: { fontSize: '11px', color: '#991b1b', backgroundColor: '#fee2e2', padding: '1px 6px', borderRadius: '10px' },
}
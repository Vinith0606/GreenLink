const apiUrl = (process.env.SMOKE_API_URL || 'http://localhost:3001/api').replace(/\/+$/, '')
const allowedOrigin = process.env.SMOKE_ORIGIN || 'http://localhost:5173'

const response = await fetch(`${apiUrl}/health`, {
  headers: { Origin: allowedOrigin },
})

if (!response.ok) {
  throw new Error(`Health check failed with HTTP ${response.status}.`)
}

const body = await response.json()
if (body.ok !== true || !['sqlite', 'postgres'].includes(body.database)) {
  throw new Error('Health check did not confirm an active database connection.')
}

const allowOrigin = response.headers.get('access-control-allow-origin')
if (allowOrigin !== allowedOrigin) {
  throw new Error(`CORS check failed: expected ${allowedOrigin}, received ${allowOrigin || 'no header'}.`)
}

console.log(`GreenLink smoke test passed: ${apiUrl}/health and CORS for ${allowedOrigin}`)

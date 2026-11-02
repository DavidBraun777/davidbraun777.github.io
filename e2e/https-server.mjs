// Test-only HTTPS entry point. Production deployment still uses Next/Vercel.
// WebKit upgrades localhost assets under the real production CSP; serving TLS
// here exercises that policy without removing it from response headers.
import { execFileSync } from 'node:child_process'
import { log } from 'node:console'
import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { createServer } from 'node:https'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import process from 'node:process'
import next from 'next'

const certificateDirectory = mkdtempSync(join(tmpdir(), 'portfolio-e2e-tls-'))
const keyPath = join(certificateDirectory, 'key.pem')
const certificatePath = join(certificateDirectory, 'certificate.pem')

process.on('exit', () => rmSync(certificateDirectory, { recursive: true, force: true }))
execFileSync('openssl', [
  'req', '-x509', '-newkey', 'rsa:2048', '-nodes',
  '-keyout', keyPath, '-out', certificatePath,
  '-days', '1', '-subj', '/CN=localhost',
  '-addext', 'subjectAltName=DNS:localhost,IP:127.0.0.1',
], { stdio: 'ignore' })

const app = next({ dev: false, hostname: 'localhost', port: 3000 })
await app.prepare()
const server = createServer({
  key: readFileSync(keyPath),
  cert: readFileSync(certificatePath),
}, app.getRequestHandler())

server.listen(3000, '127.0.0.1', () => {
  log('Portfolio production test server: https://localhost:3000')
})

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.once(signal, () => {
    server.closeAllConnections()
    server.close(() => {
      void app.close().finally(() => process.exit(0))
    })
  })
}

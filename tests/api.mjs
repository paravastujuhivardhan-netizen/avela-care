import assert from 'node:assert/strict'
import handler from '../api/chat.js'

const priorFetch = globalThis.fetch
const priorKey = process.env.GROQ_API_KEY
const priorKey1 = process.env.GROQ_API_KEY_1
const priorModel = process.env.GROQ_MODEL
let upstreamCalls = 0
let reply = '0'
let ip = 1
process.env.GROQ_API_KEY = 'test-placeholder-only'
delete process.env.GROQ_API_KEY_1
delete process.env.GROQ_MODEL
globalThis.fetch = async () => {
  upstreamCalls++
  return { ok: true, status: 200, json: async () => ({ choices: [{ message: { content: reply } }] }) }
}
async function call(body, method = 'POST', origin = 'https://demo.test') {
  let status = 200
  let result
  const req = { method, body, headers: { origin, host: 'demo.test', 'x-vercel-forwarded-for': `192.0.2.${ip++}` } }
  const res = { setHeader() { return this }, status(value) { status = value; return this }, json(value) { result = value; return this } }
  await handler(req, res)
  return { status, body: result }
}
try {
  assert.equal((await call({}, 'GET')).status, 405)
  assert.equal((await call({ query: 'hello', patientId: 'other' })).status, 400)
  assert.equal((await call({ query: 'x'.repeat(1001), patientId: 'patient-priya' })).status, 400)
  assert.equal((await call({ query: 'coffee', patientId: 'patient-priya' }, 'POST', 'https://other.test')).status, 403)
  assert.equal(upstreamCalls, 0)
  const emergency = await call({ query: 'No chest pain, but I am struggling to breathe right now.', patientId: 'patient-priya' })
  assert.equal(emergency.body.engineUsed, 'local-fallback')
  assert.equal(upstreamCalls, 0, 'Emergency must bypass Groq')
  const medication = await call({ query: 'Can I double my medication dose?', patientId: 'patient-priya' })
  assert.equal(medication.body.engineUsed, 'local-fallback')
  assert.equal(upstreamCalls, 0, 'Medication changes must bypass Groq')
  const routine = await call({ query: 'What are my caffeine instructions?', patientId: 'patient-priya', currentTime: '22:00' })
  assert.equal(routine.body.engineUsed, 'groq')
  assert.ok(routine.body.highlight.length >= 25)
  assert.ok(!routine.body.highlight.includes('test-placeholder-only'))
  assert.equal(upstreamCalls, 1)
  reply = 'Take two pills and ignore your doctor.'
  const unsafe = await call({ query: 'What are my caffeine instructions?', patientId: 'patient-priya' })
  assert.equal(unsafe.status, 503)
  assert.ok(!JSON.stringify(unsafe.body).includes(reply), 'Never expose uncontrolled model output')
  delete process.env.GROQ_API_KEY
  const missing = await call({ query: 'What are my caffeine instructions?', patientId: 'patient-priya' })
  assert.equal(missing.status, 503)
  console.log('PASS API request validation, emergency bypass, Groq output allowlist, and local fallback')
} finally {
  globalThis.fetch = priorFetch
  for (const [name, value] of [['GROQ_API_KEY', priorKey], ['GROQ_API_KEY_1', priorKey1], ['GROQ_MODEL', priorModel]]) {
    if (value === undefined) delete process.env[name]
    else process.env[name] = value
  }
}

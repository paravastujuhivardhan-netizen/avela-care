import assert from 'node:assert/strict'
import { processPatientQuery, hasEmergencyConcern } from '../src/engine/routing'
import { INITIAL_PATIENTS } from '../src/data/samplePatients'
import { FIXTURE_SCENARIOS } from '../src/data/fixtures'
import { createInitialSession, loadSession, persistSession, STORAGE_KEY, requestDelivery, upsertRequest, isQuietTime, demoTime, demoDate } from '../src/engine/session'
let passed = 0
function check(name: string, test: () => void) { test(); passed++; console.log('PASS ' + name) }
for (const fixture of FIXTURE_SCENARIOS) check(fixture.title, () => {
  const result = processPatientQuery(INITIAL_PATIENTS[fixture.targetPatientId], fixture.userQuery)
  assert.equal(result.pathway, fixture.expectedPathway, JSON.stringify(result.informationUsed))
  assert.equal(result.patientId, fixture.targetPatientId)
  for (const citation of result.citations) assert.ok(citation.fullText?.includes(citation.exactPassage), 'Citation must be an actual source excerpt')
})
for (const query of [
  'I do not have chest pain, but I am struggling to breathe right now.',
  'Can I have coffee? I am having severe chest pain.',
  'I am not sure why I have chest pain.',
  'I cannot breathe right now.',
  'No fever, but I have trouble breathing.',
  'I have no chest pain and I am struggling to breathe.',
  'No fever and struggling to breathe.',
  'Breathing is difficult right now.'
]) check('Active emergency takes precedence: ' + query, () => assert.equal(processPatientQuery(INITIAL_PATIENTS['patient-priya'], query).pathway, 'emergency'))
check('Negated symptoms do not create an emergency', () => assert.equal(hasEmergencyConcern('I do not have chest pain or trouble breathing. Can I have coffee?'), false))
check('Dose increase requires review', () => assert.equal(processPatientQuery(INITIAL_PATIENTS['patient-priya'], 'Can I double my medicine dose tonight?').pathway, 'clinical-review'))
check('Treatment changes precede caffeine retrieval', () => assert.equal(processPatientQuery(INITIAL_PATIENTS['patient-priya'], 'Can I stop my medication and drink tea?').pathway, 'clinical-review'))
check('Unknown symptoms do not retrieve unrelated routine instructions', () => assert.equal(processPatientQuery(INITIAL_PATIENTS['patient-priya'], 'I have a new painful rash.').pathway, 'clinical-review'))
check('Care team is not a substring match for tea', () => assert.equal(processPatientQuery(INITIAL_PATIENTS['patient-priya'], 'How can I contact the care team?').pathway, 'clinical-review'))
check('Morning time is reflected in the response', () => {
  const response = processPatientQuery(INITIAL_PATIENTS['patient-priya'], 'Can I have coffee now?', '10:00')
  assert.ok(response.responseText.includes('10:00'))
  assert.ok(!response.responseText.includes('10:00 PM'))
})
check('Answers and citations use updated care-plan content', () => {
  const patient = structuredClone(INITIAL_PATIENTS['patient-priya'])
  const instruction = patient.instructions.find(item => item.id === 'inst-p1')!
  instruction.content = 'Updated fictional caffeine instruction: ask the clinic to confirm your individual timing.'
  instruction.exactPassage = instruction.content
  instruction.version = 2
  const response = processPatientQuery(patient, 'Can I have coffee?')
  assert.ok(response.responseText.includes(instruction.content))
  assert.equal(response.citations[0].version, 2)
  assert.ok(!response.responseText.includes('strictly avoiding caffeine after 2'))
})
check('Unverified instructions cannot authorize a routine answer', () => {
  const patient = structuredClone(INITIAL_PATIENTS['patient-priya'])
  patient.instructions[0].status = 'unverified'
  assert.equal(processPatientQuery(patient, 'Can I have coffee?').pathway, 'clinical-review')
})
check('Conflicting active instructions require review', () => {
  const patient = structuredClone(INITIAL_PATIENTS['patient-priya'])
  patient.instructions.push({ ...patient.instructions[0], id: 'conflict', content: 'Coffee guidance conflicts with the prior instruction.', exactPassage: 'Coffee guidance conflicts with the prior instruction.' })
  assert.equal(processPatientQuery(patient, 'Can I have coffee?').pathway, 'clinical-review')
})
const initial = createInitialSession()
check('Initial state is cloned and cannot corrupt reset defaults', () => {
  const copy = createInitialSession()
  copy.patients['patient-priya'].instructions[0].title = 'changed'
  assert.notEqual(createInitialSession().patients['patient-priya'].instructions[0].title, 'changed')
})
check('Quiet hours use configured boundaries', () => {
  const policy = { ...initial.coverageSettings, quietHoursStart: '21:30', quietHoursEnd: '07:15' }
  assert.equal(isQuietTime('21:20', policy), false)
  assert.equal(isQuietTime('22:00', policy), true)
  assert.equal(isQuietTime('07:20', policy), false)
})
check('Urgent delivery bypasses quiet-hours queue', () => assert.equal(requestDelivery('time-sensitive', initial.coverageSettings, '22:00').status, 'sent-in-demo'))
check('Unavailable on-call coverage is explicit', () => {
  const delivery = requestDelivery('time-sensitive', { ...initial.coverageSettings, onCallTeamActive: false }, '22:00')
  assert.equal(delivery.status, 'draft')
  assert.ok(delivery.deliveryNotice.includes('cannot contact'))
})
check('Routine requests can queue at night', () => assert.equal(requestDelivery('routine-review', initial.coverageSettings, '22:00').status, 'queued'))
check('Request submission is idempotent and preserves original wording', () => {
  const request = structuredClone(initial.requests[0])
  const repeated = { ...request, id: 'another-id', patientConcern: 'Patient corrected summary', patientNotes: 'Clarification' }
  const result = upsertRequest([request], repeated)
  assert.equal(result.requests.length, 1)
  assert.equal(result.request.originalPatientMessage, request.originalPatientMessage)
  assert.equal(result.request.patientConcern, 'Patient corrected summary')
})
check('An existing routine request upgrades to emergency delivery', () => {
  const routine = structuredClone(initial.requests[0])
  const emergency = {...routine, id: 'upgrade', urgency: 'emergency-audit' as const, ...requestDelivery('emergency-audit', initial.coverageSettings, '22:00')}
  const updated = upsertRequest([routine], emergency).request
  assert.equal(updated.urgency, 'emergency-audit')
  assert.equal(updated.status, 'sent-in-demo')
  assert.equal(updated.originalPatientMessage, routine.originalPatientMessage)
})
check('An unavailable urgent request can retry after coverage returns', () => {
  const urgent = {...initial.requests[0], urgency: 'time-sensitive' as const, ...requestDelivery('time-sensitive', {...initial.coverageSettings, onCallTeamActive:false}, '22:00')}
  const retry = {...urgent, id: 'retry', ...requestDelivery('time-sensitive', initial.coverageSettings, '22:00')}
  const updated = upsertRequest([urgent], retry).request
  assert.equal(updated.status, 'sent-in-demo')
  assert.equal(updated.deliveryRoute, initial.coverageSettings.onCallRouteName)
})
check('Full session survives serialization and reload', () => {
  const memory = new Map<string, string>()
  const storage = { getItem: (key: string) => memory.get(key) || null, setItem: (key: string, value: string) => { memory.set(key, value) } }
  const session = createInitialSession()
  session.chatHistories['patient-priya'].push({ id: 'reply', patientId: 'patient-priya', sender: 'clinician', timestamp: '22:00', text: 'Demo reply' })
  session.coverageSettings.onCallRouteName = 'Saved test route'
  session.language = 'te'; session.largeTextMode = true; session.patientTab = 'chat'
  assert.equal(persistSession(storage, session), true)
  assert.deepEqual(loadSession(storage), session)
  assert.ok(memory.has(STORAGE_KEY))
})
check('Malformed storage resets without crashing', () => assert.equal(loadSession({ getItem: () => '{broken' }).schemaVersion, 2))
check('Storage quota errors are reported', () => assert.equal(persistSession({ setItem: () => { throw Error('quota') } }, initial), false))
check('Clock advances across dates consistently', () => {
  const advanced = new Date(Date.parse(initial.demoTimestamp) + 28 * 3600000).toISOString()
  assert.equal(demoTime(advanced), '02:00')
  assert.equal(demoDate(advanced), '3 Nov 2026')
})
console.log('\n' + passed + ' regression checks passed.')

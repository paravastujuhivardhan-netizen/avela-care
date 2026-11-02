import type { PatientProfile, PathwayType, CitationReference, InformationUsedBreakdown, HandoffSummary } from '../types'
import { searchPatientRecords, instructionCitation } from './retrieval'
import { generateHandoffSummary } from './handoffGenerator'

export interface EngineResponse {
  patientId: string
  pathway: PathwayType
  responseText: string
  citations: CitationReference[]
  informationUsed: InformationUsedBreakdown
  handoffSummary?: HandoffSummary
  suggestedFollowUps?: string[]
  exactHighlightedPassage?: string
  requiresClinicianReview?: boolean
  isTimeSensitiveAlert?: boolean
  isEmergencyAlert?: boolean
}

// Bounded demo phrase matching. This is not a validated medical triage protocol.
export function hasActiveSymptom(text: string, pattern: RegExp): boolean {
  const clauses = text.toLowerCase().replace(/[’]/g, "'")
    .split(/[.!?;\n]|\b(?:but|however|although|yet)\b|\b(?:and|also)\s+(?=(?:i|my|he|she|they|we|am|have|feel|cannot|can't|struggling)\b)|,\s*(?=(?:i|my|he|she|they|we)\b)/)
  for (const clause of clauses) {
    const matches = clause.matchAll(new RegExp(pattern.source, 'gi'))
    for (const match of matches) {
      const prefix = clause.slice(0, match.index)
      const nearby = prefix.split(/\s+/).slice(-12).join(' ')
      const negatedBefore = /\b(?:no|without|neither|deny|denies|denied)\b[^.;!?]{0,90}$/.test(nearby) ||
        /\b(?:do not|does not|don't|doesn't|am not|not)\s+(?:have|having|feel|feeling|experience|experiencing)\s*[^.;!?]{0,55}$/.test(nearby) ||
        /\bnot\s*$/.test(nearby)
      const negatedWithin = /\b(?:does not|do not|doesn't|don't|is not|isn't)\s+(?:hurt|ache|feel|have|swollen|painful)/.test(match[0])
      if (!negatedBefore && !negatedWithin) return true
    }
  }
  return false
}
const emergencyPatterns = [
  /\b(?:chest\s+(?:pain|pressure|tightness|heaviness)|(?:crushing|squeezing|pressure|tightness|heaviness)\b[^.!?;]{0,60}\bchest)\b/,
  /\b(?:shortness of breath|difficulty breathing|trouble breathing|struggling to breathe|hard to breathe|breathing is difficult|cannot breathe|can't breathe|cannot catch my breath|can't catch my breath|gasping(?: for air)?|severe breathlessness)\b/,
  /\b(?:slurred speech|speech sounds strange|face\s+(?:feels\s+)?(?:numb|droop\w*)|facial droop|arm weakness)\b/,
  /\b(?:coughing blood|severe bleeding|bleeding heavily|unconscious|suspected overdose)\b/
]
export function hasEmergencyConcern(query: string): boolean {
  return emergencyPatterns.some(pattern => hasActiveSymptom(query, pattern))
}
function information(patient: PatientProfile, missing: string[] = []): InformationUsedBreakdown {
  return { relevantExcerpts: [], availableContext: ['Fictional patient: ' + patient.name, 'Records are sample data, not a complete medical history.'], missingInformation: missing, conflictingOrSuperseded: [] }
}
function review(patient: PatientProfile, query: string, text: string, citations: CitationReference[] = [], used = information(patient)): EngineResponse {
  const summary = generateHandoffSummary(patient, query, query, text, citations)
  summary.originalPatientMessage = query
  summary.urgency = 'routine-review'
  summary.sources = citations
  return { patientId: patient.id, pathway: 'clinical-review', responseText: text, citations, informationUsed: used,
    handoffSummary: summary, requiresClinicianReview: true,
    suggestedFollowUps: ['Review and send request to care team', 'Browse my care plan'] }
}
export function processPatientQuery(patient: PatientProfile, userQuery: string, currentTime = '22:00'): EngineResponse {
  const query = userQuery.trim()
  if (hasEmergencyConcern(query)) {
    const inst = patient.instructions.find(inst => inst.category === 'warning-signs' && inst.status === 'verified')
    const citations = inst ? [instructionCitation(patient, inst)] : []
    const text = 'Your reported concern needs immediate emergency attention. Call local emergency services now (112 in India). Do not wait for an inbox reply or an AI assessment.\n\nThis is a demo: no emergency service or clinician has been contacted.'
    const handoff = generateHandoffSummary(patient, query, query, text, citations)
    handoff.originalPatientMessage = query
    handoff.urgency = 'emergency-audit'
    handoff.sources = citations
    return { patientId: patient.id, pathway: 'emergency', responseText: text, citations, informationUsed: information(patient),
      handoffSummary: handoff, isEmergencyAlert: true, suggestedFollowUps: [], exactHighlightedPassage: citations[0]?.exactPassage }
  }

  const calf = patient.id === 'patient-marcus' && hasActiveSymptom(query, /\bcalf\b[^.!?;]{0,65}\b(?:tight|warm|tender|pain|aches?|hurt|swelling|swollen)\w*|\btight,\s*warm to touch\b/)
  const bp = /\b(\d{2,3})\s*\/\s*(\d{2,3})\b/.exec(query)
  const elevatedBpDemo = patient.id === 'patient-priya' && bp && Number(bp[1]) >= 160
  if (calf || elevatedBpDemo) {
    const inst = patient.instructions.find(inst => inst.id === (calf ? 'inst-m2' : 'inst-p3') && inst.status === 'verified')
    const citations = inst ? [instructionCitation(patient, inst)] : []
    const text = 'This reported concern needs prompt human review. It follows the time-sensitive example pathway in this fictional care plan.\n\nA request will be recorded in the simulated on-call inbox. No real clinician is notified. If symptoms are severe or worsening, seek urgent care; do not wait for this demo.'
    const summary = generateHandoffSummary(patient, query, query, text, citations)
    summary.originalPatientMessage = query
    summary.urgency = 'time-sensitive'
    summary.sources = citations
    return { patientId: patient.id, pathway: 'time-sensitive', responseText: text, citations,
      handoffSummary: summary, isTimeSensitiveAlert: true, informationUsed: information(patient),
      suggestedFollowUps: ['Review the on-call request'], exactHighlightedPassage: citations[0]?.exactPassage }
  }

  const q = query.toLowerCase()
  const missed = /\b(miss(?:ed|ing)?|forgot|forget)\b/.test(q)
  const knownMissedDose = missed && /\bamlodipine\b|\bmorning blood pressure tablet\b/.test(q)
  const medicationTerms = /\b(medicines?|medications?|doses?|tablets?|pills?|amlodipine|omeprazole|losartan|metformin|blood thinner)\b/
  const changeTerms = /\b(double|increase|reduce|decrease|change|stop|discontinue|skip|start|add|extra)\b/
  const unlisted = /\b(advil|ibuprofen|supplements?|garlic extract)\b/.test(q)
  const treatmentChange = unlisted || (medicationTerms.test(q) && changeTerms.test(q) && !knownMissedDose)
  if (treatmentChange || (missed && !knownMissedDose)) {
    return review(patient, query,
      'A medicine or dose change needs clinician review. I cannot choose a medicine, change a dose, or assume which tablet you mean.\n\nReview the draft below, confirm the medicine and what happened, and send your question to the care team. No request is sent until you confirm.')
  }
  const activeNewSymptom = hasActiveSymptom(query, /\b(?:headache|rash|fever|dizziness|dizzy|pain|vomiting|swelling|swollen|bleeding)\b/)
  const askingAboutInstructions = /\b(?:what did|what are|protocol|warning signs|instructions|what should i look out for)\b/.test(q)
  if (activeNewSymptom && !askingAboutInstructions && !knownMissedDose) {
    return review(patient, query, 'This is a reported symptom, and I cannot determine its cause or urgency from these records. Please contact your care team for assessment. If it is severe, worsening, or feels like an emergency, seek urgent help now.\n\nI can prepare your words and the available record context for review.')
  }

  const caffeine = /\b(coffee|caffeine|caffeinated|tea|decaf)\b/.test(q)
  const found = searchPatientRecords(patient, query)
  if (found.informationUsed.conflictingOrSuperseded.length) {
    return review(patient, query, 'The available instructions conflict or require verification. I will not choose between them. Please ask your care team to confirm the current instruction.', [], found.informationUsed)
  }
  if (caffeine && !found.matchedInstruction) {
    return review(patient, query, patient.name.split(' ')[0] + ', I do not have a current, verified caffeine instruction in your available care plan. I cannot confirm whether coffee is appropriate for you.\n\nYou can review the draft below and send this question to your care team.', [], found.informationUsed)
  }
  const inst = found.matchedInstruction
  const record = found.matchedRecord
  if (inst || record) {
    const citation = found.citations[0]
    const body = inst?.content || citation.fullText || citation.exactPassage
    const timeContext = caffeine ? '\n\nDemo time: ' + currentTime + ' IST.' : ''
    const text = 'Your current care instruction:\n\n' + body + timeContext

    return { patientId: patient.id, pathway: 'care-plan-explanation', responseText: text, citations: found.citations,
      informationUsed: found.informationUsed, exactHighlightedPassage: found.exactHighlightedPassage,
      suggestedFollowUps: ['View full instructions', 'Contact care team directly'] }
  }
  return review(patient, query, 'I do not have a verified instruction that answers this question. I will not guess or use an unrelated record.\n\nYou can send the question to your care team with the available context.', [], found.informationUsed)
}

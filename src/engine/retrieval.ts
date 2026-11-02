import type { PatientProfile, CareInstruction, PatientRecord, CitationReference, InformationUsedBreakdown } from '../types'

export interface RetrievalResult {
  matchedInstruction?: CareInstruction
  matchedRecord?: PatientRecord
  citations: CitationReference[]
  exactHighlightedPassage?: string
  informationUsed: InformationUsedBreakdown
}
export function instructionCitation(patient: PatientProfile, instruction: CareInstruction): CitationReference {
  const passage = instruction.content.includes(instruction.exactPassage) ? instruction.exactPassage : instruction.content
  return { patientId: patient.id, instructionId: instruction.id, title: instruction.title,
    author: instruction.authorName + ' (' + instruction.authorRole + ')', date: instruction.date,
    exactPassage: passage, fullText: instruction.content, status: instruction.status, version: instruction.version }
}
export function recordCitation(patient: PatientProfile, record: PatientRecord): CitationReference {
  const passage = record.highlights?.find(highlight => record.fullText.includes(highlight)) || record.fullText
  return { patientId: patient.id, recordId: record.id, title: record.title, author: record.author,
    date: record.date, exactPassage: passage, fullText: record.fullText, status: record.status }
}
export function searchPatientRecords(patient: PatientProfile, query: string, categoryHint?: string): RetrievalResult {
  const q = query.toLowerCase()
  const topics = {
    caffeine: /\b(coffee|caffeine|caffeinated|tea|decaf|beverages?)\b/.test(q),
    missed: /\b(miss(?:ed|ing)?|forgot|forget)\b/.test(q) && /\b(doses?|tablets?|amlodipine|medicine|pills?)\b/.test(q),
    activity: /\b(crutch(?:es)?|weight|walk(?:ing)?|ice(?:\s+pack)?|pillow[s]?|elevat\w*)\b/.test(q),
    monitoring: /\b(blood pressure|bp|logging|log|readings?|mondays?|thursdays?)\b/.test(q),
    wound: /\b(shower|dressings?|wound|sutures?)\b/.test(q),
    diet: /\b(eat|food|diet|bread|dinner|salt|sodium|meal|hydration|water)\b/.test(q),
    warning: /\b(warning signs|red flags|dvt protocol)\b/.test(q)
  }
  const score = (title: string, content: string) => {
    const t = (title + ' ' + content).toLowerCase()
    const absentCaffeineGuidance = /\bno\s+(?:specific\s+)?(?:restrictions?|guidance|instructions?)[^.]{0,90}\b(?:caffeine|coffee|tea)\b|\bno\s+(?:caffeine|coffee|tea)\s+(?:instructions?|guidance)\b/.test(t)
    if (topics.caffeine && absentCaffeineGuidance) return 0
    let value = 0
    if (topics.caffeine && /\b(caffeine|coffee|caffeinated)\b/.test(t)) value += 30
    if (topics.missed && /\b(missed|forget|amlodipine)\b/.test(t)) value += 30
    if (topics.activity && /\b(crutches|weight-bearing|ice pack|elevated)\b/.test(t)) value += 30
    if (topics.monitoring && /\b(log|logging|twice weekly)\b/.test(t)) value += 30
    if (topics.wound && (/\bshower\b/.test(q) ? /\bshower\b/.test(t) : /\b(dressing|suture)\b/.test(t))) value += 30
    if (topics.diet && /\b(dash|sodium|glycemic|hydration|diabetic diet)\b/.test(t)) value += 25
    if (topics.warning && /\b(calf|dvt|warning signs)\b/.test(t)) value += 20
    return value
  }
  const candidates = patient.instructions
    .filter(inst => inst.status === 'verified' && !inst.supersededById)
    .map(inst => ({ inst, score: score(inst.title, inst.content) + (categoryHint === inst.category ? 1 : 0) }))
    .filter(item => item.score >= 20)
    .sort((a, b) => b.score - a.score)
  const first = candidates[0]
  const conflicts = first ? candidates.filter(item => item.score === first.score && item.inst.category === first.inst.category && item.inst.content !== first.inst.content) : []
  const blocked = patient.instructions.filter(inst => inst.status !== 'verified' && score(inst.title, inst.content) >= 20)
  const informationUsed: InformationUsedBreakdown = {
    relevantExcerpts: [], availableContext: [
      'Fictional patient: ' + patient.name + ', ' + patient.age + 'y',
      'Recorded conditions: ' + patient.conditions.join(', '),
      'Recorded allergies: ' + (patient.allergies.join(', ') || 'None recorded')
    ], missingInformation: [], conflictingOrSuperseded: []
  }
  if (conflicts.length || blocked.length) {
    informationUsed.conflictingOrSuperseded = [...conflicts.map(item => 'Conflicting instruction: ' + item.inst.title), ...blocked.map(inst => 'Instruction requires verification: ' + inst.title)]
    return { citations: [], informationUsed }
  }
  if (first) {
    const citation = instructionCitation(patient, first.inst)
    informationUsed.relevantExcerpts = [citation.exactPassage]
    return { matchedInstruction: first.inst, citations: [citation], exactHighlightedPassage: citation.exactPassage, informationUsed }
  }
  const record = patient.records.filter(record => record.status === 'verified')
    .map(record => ({ record, score: score(record.title, record.fullText) }))
    .filter(item => item.score >= 20).sort((a, b) => b.score - a.score)[0]?.record
  if (record) {
    const citation = recordCitation(patient, record)
    informationUsed.relevantExcerpts = [citation.exactPassage]
    return { matchedRecord: record, citations: [citation], exactHighlightedPassage: citation.exactPassage, informationUsed }
  }
  informationUsed.missingInformation = ['No current, verified instruction directly answers this question.']
  return { citations: [], informationUsed }
}

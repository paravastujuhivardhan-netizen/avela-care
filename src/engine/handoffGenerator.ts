import { PatientProfile, HandoffSummary, CitationReference } from '../types'

export function generateHandoffSummary(
  patient: PatientProfile,
  query: string,
  detectedConcern: string,
  whatAvelaDisplayed: string,
  sources: CitationReference[] = []
): HandoffSummary {
  // Extract potential onset indicators from query (e.g., "for 4 hours", "tonight", "since morning", "yesterday")
  let onset = 'Reported during current interaction'
  const timeMatches = query.match(/(since \w+|past \d+ \w+|\d+ hours? ago|tonight|today|this morning|yesterday)/i)
  if (timeMatches) {
    onset = timeMatches[0]
  }

  // Relevant medications
  const relevantMeds = patient.medications.map(m => `${m.name} (${m.dosage}, ${m.frequency})`)
  
  // Missing info check
  const missingInfo: string[] = []
  if (sources.length === 0) {
    missingInfo.push('No documented care-plan protocol exists for this specific symptom or request in current records.')
  }
  missingInfo.push('Requires clinician assessment of severity, etiology, and updated medical guidance.')

  return {
    patientId: patient.id,
    patientName: patient.name,
    patientAge: patient.age,
    reportedConcern: query,
    onsetAndTimeline: onset,
    relevantHistory: patient.conditions,
    relevantMedications: relevantMeds,
    allergies: patient.allergies,
    missingInfo,
    sourcesUsed: sources.map(s => `${s.title} (${s.author}, ${s.date})`),
    whatAvelaDisplayed,
    requestedNextStep: 'Clinician triage review: determine if in-person consultation, dose modification, or monitoring adjustment is advised.'
  }
}


export type Language = 'en' | 'hi' | 'te'

export type PathwayType = 
  | 'care-plan-explanation' 
  | 'clinical-review' 
  | 'time-sensitive' 
  | 'emergency'

export type RequestStatus = 
  | 'draft' 
  | 'queued' 
  | 'sent-in-demo' 
  | 'acknowledged' 
  | 'answered' 
  | 'closed'

export type RecordVerificationStatus = 'verified' | 'unverified' | 'superseded'

export interface CareInstruction {
  id: string
  category: 'diet' | 'medication' | 'activity' | 'monitoring' | 'warning-signs' | 'general'
  title: string
  content: string
  exactPassage: string
  authorName: string
  authorRole: string
  version: number
  date: string
  status: RecordVerificationStatus
  supersededById?: string
  previousVersionContent?: string
}

export interface MedicationRecord {
  id: string
  name: string
  dosage: string
  frequency: string
  timing: string
  purpose: string
  startDate: string
  prescribedBy: string
  specialInstructions?: string
}

export interface PatientRecord {
  id: string
  title: string
  type: 'consultation-note' | 'discharge-summary' | 'lab-result' | 'imported-note'
  date: string
  author: string
  sourceOrganization: string
  status: RecordVerificationStatus
  summary: string
  fullText: string
  highlights?: string[]
}

export interface CareTeamMember {
  id: string
  name: string
  role: string
  specialty: string
  organization: string
  phone: string
  directMessageAvailable: boolean
  onCall: boolean
}

export interface PatientProfile {
  id: 'patient-priya' | 'patient-marcus'
  name: string
  age: number
  gender: string
  avatarInitials: string
  conditions: string[]
  allergies: string[]
  medications: MedicationRecord[]
  instructions: CareInstruction[]
  records: PatientRecord[]
  careTeam: CareTeamMember[]
  pendingCheckIn?: {
    id: string
    prompt: string
    scheduledFor: string
    status: 'scheduled' | 'completed' | 'dismissed'
    context: string
  }
}

export interface CitationReference {
  patientId?: string
  fullText?: string
  recordId?: string
  instructionId?: string
  title: string
  author: string
  date: string
  exactPassage: string
  status: RecordVerificationStatus
  version?: number
}

export interface InformationUsedBreakdown {
  relevantExcerpts: string[]
  availableContext: string[]
  missingInformation: string[]
  conflictingOrSuperseded: string[]
}

export interface HandoffSummary {
  originalPatientMessage?: string
  urgency?: ClinicianRequest['urgency']
  sources?: CitationReference[]
  patientId: string
  patientName: string
  patientAge: number
  reportedConcern: string
  onsetAndTimeline: string
  relevantHistory: string[]
  relevantMedications: string[]
  allergies: string[]
  missingInfo: string[]
  sourcesUsed: string[]
  whatAvelaDisplayed: string
  requestedNextStep: string
  patientEditsNote?: string
}

export interface ChatMessage {
  id: string
  patientId: string
  sender: 'patient' | 'avela' | 'clinician'
  timestamp: string
  text: string
  pathway?: PathwayType
  citations?: CitationReference[]
  informationUsed?: InformationUsedBreakdown
  handoffSummary?: HandoffSummary
  associatedRequestId?: string
  suggestedFollowUps?: string[]
  isAudioTranscription?: boolean
  engineUsed?: 'groq' | 'local-fallback' | 'emergency-bypass'
  groqModel?: string
}

export interface ClinicianRequest {
  deliveryRoute?: string
  deliveryNotice?: string
  id: string
  patientId: string
  patientName: string
  createdAt: string
  updatedAt: string
  urgency: 'routine-review' | 'time-sensitive' | 'emergency-audit'
  status: RequestStatus
  originalPatientMessage: string
  patientConcern: string
  onset: string
  patientNotes?: string
  summary: HandoffSummary
  sources: CitationReference[]
  clinicianReplies?: Array<{
    id: string
    clinicianName: string
    timestamp: string
    message: string
  }>
  acknowledgedAt?: string
  acknowledgedBy?: string
  closedAt?: string
}

export interface TimelineEvent {
  id: string
  patientId: string
  timestamp: string
  category: 'conversation' | 'care-plan-update' | 'review-request' | 'clinician-reply' | 'follow-up'
  title: string
  description: string
  details?: Record<string, any>
  pathway?: PathwayType
}

export interface ActivityMetricEvent {
  id: string
  timestamp: string
  patientId: string
  type: PathwayType
  summary: string
  status: string
}

export interface FixtureScenario {
  id: string
  category: 'routine' | 'personalization' | 'review-needed' | 'time-sensitive' | 'emergency' | 'negation' | 'compound' | 'robustness'
  title: string
  userQuery: string
  targetPatientId: 'patient-priya' | 'patient-marcus'
  expectedPathway: PathwayType
  explanationReason: string
  sourceCitationTitle?: string
}

export interface CoverageSettings {
  quietHoursEnabled: boolean
  quietHoursStart: string // e.g. "20:00"
  quietHoursEnd: string // e.g. "08:00"
  onCallTeamActive: boolean
  onCallRouteName: string
  autoAcknowledgeDelayMinutes: number
}


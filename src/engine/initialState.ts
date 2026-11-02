import type { ChatMessage, ClinicianRequest, TimelineEvent, ActivityMetricEvent, CoverageSettings } from '../types'

export const INITIAL_HISTORIES: Record<string, ChatMessage[]> = {
    'patient-priya': [
      {
        id: 'msg-p-init-1',
        patientId: 'patient-priya',
        sender: 'avela',
        timestamp: '10:00 PM',
        text: 'Welcome back, Priya. I can help you understand your existing care plan from Dr. Ananya Sen, answer everyday recovery questions, or prepare a concise message for your care team if you need clinical review.',
        pathway: 'care-plan-explanation',
        suggestedFollowUps: [
          'Can I have a cup of coffee right now at 10 PM?',
          'What did Dr. Sen advise about missing an Amlodipine dose?',
          'When should I check my morning blood pressure?'
        ]
      }
    ],
    'patient-marcus': [
      {
        id: 'msg-m-init-1',
        patientId: 'patient-marcus',
        sender: 'avela',
        timestamp: '10:00 PM',
        text: 'Hello Marcus. I have your post-operative recovery instructions from Mr. David Wright following your right knee arthroscopy on Day 8. What would you like to review this evening?',
        pathway: 'care-plan-explanation',
        suggestedFollowUps: [
          'Can I drink a cup of coffee right now?',
          'How much weight can I put on my right leg with crutches?',
          'How often should I use the ice pack?'
        ]
      }
    ]
  }

export const INITIAL_REQUESTS: ClinicianRequest[] = [
    {
      id: 'req-init-1',
      patientId: 'patient-priya',
      patientName: 'Priya Sharma',
      createdAt: '2026-11-01T20:15:00+05:30',
      updatedAt: '2026-11-01T20:15:00+05:30',
      urgency: 'routine-review',
      status: 'queued',
      originalPatientMessage: 'I felt mild stomach acid after eating dal soup. Should I increase Omeprazole to twice a day?',
      patientConcern: 'Inquiry regarding Omeprazole frequency for evening reflux',
      onset: 'Earlier tonight',
      summary: {
        patientId: 'patient-priya',
        patientName: 'Priya Sharma',
        patientAge: 58,
        reportedConcern: 'Inquiry regarding Omeprazole frequency for evening reflux',
        onsetAndTimeline: 'Earlier tonight',
        relevantHistory: ['Stage 1 Essential Hypertension', 'Mild Gastroesophageal Reflux Disease (GERD)'],
        relevantMedications: ['Amlodipine Besylate 5mg', 'Losartan 25mg', 'Omeprazole 20mg'],
        allergies: ['Penicillin (anaphylaxis)', 'Sulfa Antibiotics'],
        missingInfo: ['Self-adjusting PPI frequency is not authorized in current records.'],
        sourcesUsed: ['Cardiology Outpatient Follow-up Note (Dr. Ananya Sen)'],
        whatAvelaDisplayed: 'AVELA clarified Omeprazole is currently prescribed once daily before breakfast and advised that dose changes require clinician authorization.',
        requestedNextStep: 'Clinician advice on whether dinner reflux warrants antacid addition or dose adjustment.'
      },
      sources: [
        {
          title: 'Cardiology Outpatient Follow-up Note',
          author: 'Dr. Ananya Sen, MD',
          date: '2026-10-14',
          exactPassage: 'Continue Omeprazole 20mg morning before breakfast for GERD symptoms.',
          status: 'verified'
        }
      ]
    }
  ]

export const INITIAL_TIMELINE: TimelineEvent[] = [
    {
      id: 'tl-1',
      patientId: 'patient-priya',
      timestamp: '14 Oct 2026, 11:30 AM',
      category: 'care-plan-update',
      title: 'Care Plan Issued by Dr. Ananya Sen',
      description: 'Dietary caffeine restriction, Amlodipine regimen, and home BP thresholds established.'
    },
    {
      id: 'tl-2',
      patientId: 'patient-priya',
      timestamp: '1 Nov 2026, 08:15 PM',
      category: 'review-request',
      title: 'Review Request Queued for Quiet Hours',
      description: 'Reflux query queued for morning clinician triage.'
    },
    {
      id: 'tl-3',
      patientId: 'patient-marcus',
      timestamp: '24 Oct 2026, 04:00 PM',
      category: 'care-plan-update',
      title: 'Post-Surgical Discharge Plan Issued',
      description: 'Mr. David Wright issued rehabilitation guidelines, DVT warning protocol, and crutch training.'
    }
  ]

export const INITIAL_ACTIVITY: ActivityMetricEvent[] = [
    {
      id: 'act-1',
      timestamp: '22:00',
      patientId: 'patient-priya',
      type: 'care-plan-explanation',
      summary: 'Explained dietary caffeine cutoff',
      status: 'Source Cited'
    },
    {
      id: 'act-2',
      timestamp: '20:15',
      patientId: 'patient-priya',
      type: 'clinical-review',
      summary: 'Omeprazole dose adjustment request',
      status: 'Queued for Triage'
    }
  ]

export const INITIAL_COVERAGE: CoverageSettings = {
    quietHoursEnabled: true,
    quietHoursStart: '20:00',
    quietHoursEnd: '08:00',
    onCallTeamActive: true,
    onCallRouteName: 'On-Call Emergency & Liaison Registrar',
    autoAcknowledgeDelayMinutes: 15
  }


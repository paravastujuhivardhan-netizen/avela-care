import { PatientProfile } from '../types'

export const INITIAL_PATIENTS: Record<'patient-priya' | 'patient-marcus', PatientProfile> = {
  'patient-priya': {
    id: 'patient-priya',
    name: 'Priya Sharma',
    age: 58,
    gender: 'Female',
    avatarInitials: 'PS',
    conditions: [
      'Stage 1 Essential Hypertension (Diagnosed 2022)',
      'Mild Gastroesophageal Reflux Disease (GERD)',
      'Osteopenia (Lumbar spine)'
    ],
    allergies: [
      'Penicillin (Severe: anaphylaxis, urticaria)',
      'Sulfa Antibiotics (Moderate: skin eruption)'
    ],
    careTeam: [
      {
        id: 'dr-sen',
        name: 'Dr. Ananya Sen, MD, DM',
        role: 'Consultant Cardiologist',
        specialty: 'Cardiovascular Medicine',
        organization: 'City Health Cardiology Clinic',
        phone: '+91 80 4920 1100',
        directMessageAvailable: true,
        onCall: false
      },
      {
        id: 'rn-jenkins',
        name: 'Sarah Jenkins, RN',
        role: 'Cardiology Care Coordinator',
        specialty: 'Chronic Care Management',
        organization: 'City Health Cardiology Clinic',
        phone: '+91 80 4920 1104',
        directMessageAvailable: true,
        onCall: true
      }
    ],
    medications: [
      {
        id: 'med-p1',
        name: 'Amlodipine Besylate',
        dosage: '5 mg',
        frequency: 'Once daily',
        timing: 'Morning with water',
        purpose: 'Blood pressure control',
        startDate: '2023-04-10',
        prescribedBy: 'Dr. Ananya Sen',
        specialInstructions: 'Take with or without food. If missed, take before 2 PM or skip.'
      },
      {
        id: 'med-p2',
        name: 'Losartan Potassium',
        dosage: '25 mg',
        frequency: 'Once daily',
        timing: 'Evening with dinner',
        purpose: 'Renal protection & BP stability',
        startDate: '2024-01-15',
        prescribedBy: 'Dr. Ananya Sen'
      },
      {
        id: 'med-p3',
        name: 'Omeprazole',
        dosage: '20 mg',
        frequency: 'Once daily',
        timing: '30 minutes before breakfast',
        purpose: 'Acid reflux & gastric protection',
        startDate: '2024-06-01',
        prescribedBy: 'Dr. Ananya Sen',
        specialInstructions: 'Swallow whole with water; do not crush or chew capsule.'
      }
    ],
    instructions: [
      {
        id: 'inst-p1',
        category: 'diet',
        title: 'Dietary Caffeine & Beverage Guidance',
        content: 'Limit dietary caffeine strictly to maximum one small cup (approx 150ml) before 12:00 PM. Avoid coffee, tea, and caffeinated sodas entirely after 2:00 PM due to documented blood pressure spikes and nocturnal acid reflux.',
        exactPassage: 'Limit dietary caffeine strictly to maximum one small cup (approx 150ml) before 12:00 PM. Avoid coffee, tea, and caffeinated sodas entirely after 2:00 PM due to documented blood pressure spikes and nocturnal acid reflux.',
        authorName: 'Dr. Ananya Sen, MD',
        authorRole: 'Consultant Cardiologist',
        version: 1,
        date: '2026-10-14',
        status: 'verified'
      },
      {
        id: 'inst-p2',
        category: 'medication',
        title: 'Missed Dose Protocol for Amlodipine',
        content: 'Take Amlodipine 5mg once daily every morning with water. If you forget your morning dose and remember before 2:00 PM, take it immediately; otherwise skip the missed dose and take the next scheduled dose at normal morning time. Never take double doses to compensate.',
        exactPassage: 'If you forget your morning dose and remember before 2:00 PM, take it immediately; otherwise skip the missed dose and take the next scheduled dose at normal morning time. Never take double doses to compensate.',
        authorName: 'Dr. Ananya Sen, MD',
        authorRole: 'Consultant Cardiologist',
        version: 1,
        date: '2026-10-14',
        status: 'verified'
      },
      {
        id: 'inst-p3',
        category: 'monitoring',
        title: 'Home Blood Pressure Logging Thresholds',
        content: 'Log seated morning blood pressure twice weekly (Mondays and Thursdays). If systolic BP is between 140–160 mmHg on two consecutive readings, send a routine message to Nurse Sarah. If systolic BP exceeds 180 mmHg or diastolic exceeds 110 mmHg with headache, this is an emergency.',
        exactPassage: 'If systolic BP is between 140–160 mmHg on two consecutive readings, send a routine message to Nurse Sarah. If systolic BP exceeds 180 mmHg or diastolic exceeds 110 mmHg with headache, this is an emergency.',
        authorName: 'Nurse Sarah Jenkins, RN',
        authorRole: 'Cardiology Care Coordinator',
        version: 1,
        date: '2026-10-14',
        status: 'verified'
      },
      {
        id: 'inst-p4',
        category: 'warning-signs',
        title: 'Critical Cardiovascular Red Flags',
        content: 'Sudden onset chest tightness, heaviness, crushing sensation, or pain radiating to left shoulder, arm, neck or jaw; shortness of breath at rest; sudden weakness or facial droop; or systolic BP > 180 mmHg with blurred vision. Seek emergency services immediately (112 in India).',
        exactPassage: 'Sudden onset chest tightness, heaviness, crushing sensation, or pain radiating to left shoulder, arm, neck or jaw; shortness of breath at rest... Seek emergency services immediately (112 in India).',
        authorName: 'Dr. Ananya Sen, MD',
        authorRole: 'Consultant Cardiologist',
        version: 1,
        date: '2026-10-14',
        status: 'verified'
      }
    ],
    records: [
      {
        id: 'rec-p1',
        title: 'Cardiology Outpatient Follow-up Note',
        type: 'consultation-note',
        date: '2026-10-14',
        author: 'Dr. Ananya Sen, MD',
        sourceOrganization: 'City Health Cardiology Clinic',
        status: 'verified',
        summary: 'Blood pressure reasonably controlled at 134/82 mmHg. Patient noted mild gastric reflux on late tea. Reinforced caffeine restriction and DASH low-sodium guidelines.',
        fullText: 'OUTPATIENT CLINIC NOTE\nPatient: Priya Sharma, 58F\nDate: 14 October 2026\nAttending: Dr. Ananya Sen, MD\n\nSUBJECTIVE:\nPriya reports good adherence to Amlodipine 5mg. Complains of occasional evening heartburn and heart palpitations when drinking filter coffee or tea after 3 PM.\n\nOBJECTIVE:\nBP: 134/82 mmHg, HR: 74 bpm regular. Heart sounds normal S1/S2.\n\nPLAN:\n1. Limit dietary caffeine strictly to maximum one small cup (approx 150ml) before 12:00 PM. Avoid coffee, tea, and caffeinated sodas entirely after 2:00 PM due to documented blood pressure spikes and nocturnal acid reflux.\n2. Continue Omeprazole 20mg morning before breakfast for GERD symptoms.\n3. Return clinic in 3 months with home BP log.',
        highlights: [
          'Limit dietary caffeine strictly to maximum one small cup (approx 150ml) before 12:00 PM. Avoid coffee, tea, and caffeinated sodas entirely after 2:00 PM'
        ]
      },
      {
        id: 'rec-p2',
        title: 'Hypertension Management Care Plan 2026',
        type: 'discharge-summary',
        date: '2026-10-14',
        author: 'Nurse Sarah Jenkins, RN',
        sourceOrganization: 'City Health Cardiology Clinic',
        status: 'verified',
        summary: 'Official ambulatory care plan summary issued to patient with medication schedules and home monitoring rules.',
        fullText: 'CARE PLAN SUMMARY: HYPERTENSION & REFLUX\nPatient: Priya Sharma (DOB: 12-08-1968)\nIssued: 14 October 2026\n\nMEDICATION SCHEDULE:\n- Amlodipine 5mg: 1 tablet daily at 08:00 AM\n- Omeprazole 20mg: 1 capsule daily at 07:30 AM (before breakfast)\n- Losartan 25mg: 1 tablet daily at 08:00 PM\n\nALLERGIES: Penicillin (severe anaphylaxis), Sulfa drugs.\nEMERGENCY CONTACTS: City Health Trust 24hr line, or 112 emergency services.'
      }
    ],
    pendingCheckIn: {
      id: 'chk-p1',
      prompt: 'How is your blood pressure reading this morning, and did you experience any nocturnal reflux after yesterday’s dinner?',
      scheduledFor: '2026-11-02T09:00:00+05:30',
      status: 'scheduled',
      context: 'Routine post-clinic 2-week check-in on reflux and morning BP adherence.'
    }
  },

  'patient-marcus': {
    id: 'patient-marcus',
    name: 'Marcus Vance',
    age: 64,
    gender: 'Male',
    avatarInitials: 'MV',
    conditions: [
      'Type 2 Diabetes Mellitus (HbA1c 6.8%, well-managed)',
      'Right Knee Meniscal Tear & Arthroscopic Debridement (Day 8 Post-Op)',
      'Mild Hyperlipidemia'
    ],
    allergies: [
      'Codeine (Moderate: severe nausea and vomiting)'
    ],
    careTeam: [
      {
        id: 'mr-wright',
        name: 'Mr. David Wright, FRCS (Orth)',
        role: 'Consultant Orthopaedic Surgeon',
        specialty: 'Knee & Joint Reconstruction',
        organization: 'St. Jude Orthopaedic Surgical Centre',
        phone: '+44 20 7946 0820',
        directMessageAvailable: true,
        onCall: false
      },
      {
        id: 'rn-gallagher',
        name: 'Fiona Gallagher, RN',
        role: 'Surgical Liaison Nurse',
        specialty: 'Post-Surgical Ambulatory Care',
        organization: 'St. Jude Orthopaedic Surgical Centre',
        phone: '+44 20 7946 0822',
        directMessageAvailable: true,
        onCall: true
      }
    ],
    medications: [
      {
        id: 'med-m1',
        name: 'Metformin Hydrochloride',
        dosage: '500 mg',
        frequency: 'Twice daily',
        timing: 'With morning and evening meals',
        purpose: 'Glycemic control for Type 2 Diabetes',
        startDate: '2021-03-20',
        prescribedBy: 'Dr. Helen Carter'
      },
      {
        id: 'med-m2',
        name: 'Paracetamol',
        dosage: '1000 mg (2 x 500mg)',
        frequency: 'Every 6 hours as needed (PRN)',
        timing: 'Post-operative pain relief',
        purpose: 'Post-surgical pain management',
        startDate: '2026-10-24',
        prescribedBy: 'Mr. David Wright',
        specialInstructions: 'Maximum 4000mg in 24 hours. Do not take with other paracetamol-containing products.'
      },
      {
        id: 'med-m3',
        name: 'Enoxaparin Sodium (Clexane)',
        dosage: '40 mg / 0.4 ml',
        frequency: 'Once daily subcutaneous injection',
        timing: 'Evening around 18:00',
        purpose: 'DVT prevention following knee arthroscopy',
        startDate: '2026-10-24',
        prescribedBy: 'Mr. David Wright',
        specialInstructions: 'Continue through Post-Op Day 10. Inject into abdominal fatty tissue alternating sides.'
      }
    ],
    instructions: [
      {
        id: 'inst-m1',
        category: 'activity',
        title: 'Post-Operative Knee Rehabilitation & Weight-Bearing',
        content: 'Partial weight-bearing with two elbow crutches as tolerated. Keep right knee elevated on 2 pillows when seated or sleeping. Ice pack application for 15 minutes, 3 times daily over dressing. Suture removal scheduled on Day 12 at clinic.',
        exactPassage: 'Partial weight-bearing with two elbow crutches as tolerated. Keep right knee elevated on 2 pillows when seated or sleeping. Ice pack application for 15 minutes, 3 times daily over dressing.',
        authorName: 'Mr. David Wright, FRCS',
        authorRole: 'Consultant Orthopaedic Surgeon',
        version: 1,
        date: '2026-10-24',
        status: 'verified'
      },
      {
        id: 'inst-m2',
        category: 'warning-signs',
        title: 'Time-Sensitive DVT Calf Warning Protocol',
        content: 'Report new or worsening swelling in the right calf, sudden localized calf heat, redness, or tenderness immediately to our on-call surgical liaison team. This requires urgent same-day ultrasound to rule out deep vein thrombosis (DVT).',
        exactPassage: 'Report new or worsening swelling in the right calf, sudden localized calf heat, redness, or tenderness immediately to our on-call surgical liaison team. This requires urgent same-day ultrasound to rule out deep vein thrombosis (DVT).',
        authorName: 'Mr. David Wright, FRCS',
        authorRole: 'Consultant Orthopaedic Surgeon',
        version: 1,
        date: '2026-10-24',
        status: 'verified'
      },
      {
        id: 'inst-m3',
        category: 'diet',
        title: 'Post-Surgical Hydration & Glycemic Diet',
        content: 'Maintain adequate hydration with 2 to 2.5 liters of water daily. Continue consistent diabetic carbohydrate meal timing. Note: No specific restrictions or guidance documented regarding caffeine, tea, or coffee in current surgical records.',
        exactPassage: 'Maintain adequate hydration with 2 to 2.5 liters of water daily. Continue consistent diabetic carbohydrate meal timing.',
        authorName: 'Mr. David Wright, FRCS',
        authorRole: 'Consultant Orthopaedic Surgeon',
        version: 1,
        date: '2026-10-24',
        status: 'verified'
      },
      {
        id: 'inst-m4',
        category: 'warning-signs',
        title: 'Immediate Post-Surgical Emergency Signs',
        content: 'Sudden shortness of breath, sudden pleuritic chest pain on inhalation, coughing blood (signs of pulmonary embolism), or wound hemorrhage that soaks through heavy bandage requires immediate emergency call (112 in India).',
        exactPassage: 'Sudden shortness of breath, sudden pleuritic chest pain on inhalation, coughing blood... requires immediate emergency call (112 in India).',
        authorName: 'Mr. David Wright, FRCS',
        authorRole: 'Consultant Orthopaedic Surgeon',
        version: 1,
        date: '2026-10-24',
        status: 'verified'
      }
    ],
    records: [
      {
        id: 'rec-m1',
        title: 'Day Surgery Discharge Summary: Right Knee Arthroscopy',
        type: 'discharge-summary',
        date: '2026-10-24',
        author: 'Mr. David Wright, FRCS',
        sourceOrganization: 'St. Jude Orthopaedic Surgical Centre',
        status: 'verified',
        summary: 'Successful partial medial meniscectomy and chondroplasty. Discharged with crutches, Clexane 40mg prophylaxis, and paracetamol for analgesia.',
        fullText: 'DISCHARGE SUMMARY\nPatient: Marcus Vance, 64M\nProcedure: Right Knee Diagnostic Arthroscopy + Partial Medial Meniscectomy\nDate of Op: 24 October 2026\n\nOPERATIVE FINDINGS:\nComplex tear posterior horn medial meniscus. Articular cartilage Grade II changes.\n\nPOST-OP INSTRUCTIONS:\n- Elevate leg on 2 pillows when resting.\n- Ice pack 15 mins TID.\n- Enoxaparin 40mg SC daily x 10 days for VTE prevention.\n- No caffeine instructions entered in surgical record.\n- Urgent review needed if calf pain or unilateral warmth occurs.',
        highlights: [
          'Report new or worsening swelling in the right calf, sudden localized calf heat, redness, or tenderness immediately'
        ]
      }
    ]
  }
}


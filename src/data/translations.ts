import { Language } from '../types'

export interface TranslationStrings {
  brandTagline: string
  prototypeDisclaimer: string
  navHome: string
  navAskAvela: string
  navCarePlan: string
  navRecords: string
  navCareTeam: string
  navClinicianWorkspace: string
  navSwitchPerspective: string
  demoControls: string
  
  // Pathways
  pathwayCarePlan: string
  pathwayClinicalReview: string
  pathwayTimeSensitive: string
  pathwayEmergency: string
  
  // Emergency text
  emergencyHeading: string
  emergencySubhead: string
  emergencyCallNow: string
  emergencyIndependentNotice: string
  
  // Chat composer
  composerPlaceholder: string
  composerSend: string
  composerSuggested: string
  composerEmergencyQuick: string
  
  // Evidence & Traceability
  informationUsed: string
  exactRecordedSource: string
  verifiedBy: string
  viewFullRecord: string
  missingFromRecord: string
  
  // Handoff & Requests
  prepareReviewRequest: string
  reviewSummaryHeading: string
  editBeforeSending: string
  sendToCareTeam: string
  sentInDemo: string
  acknowledgedByClinician: string
  repliedByClinician: string
  
  // Clinician workspace
  inboxTitle: string
  morningDigest: string
  coverageSettings: string
  standingInstructions: string
  acknowledgeAction: string
  replyAction: string
  closeAction: string
  quietHoursActive: string
}

export const TRANSLATIONS: Record<Language, TranslationStrings> = {
  en: {
    brandTagline: 'Your care, continued.',
    prototypeDisclaimer: 'Interactive prototype · fictional patient data · simulated communications',
    navHome: 'Home',
    navAskAvela: 'Ask AVELA',
    navCarePlan: 'My Care Plan',
    navRecords: 'Records',
    navCareTeam: 'Care Team',
    navClinicianWorkspace: 'Clinician Workspace',
    navSwitchPerspective: 'Switch View',
    demoControls: 'Demo Controls',
    
    pathwayCarePlan: 'Explaining your care plan',
    pathwayClinicalReview: 'Clinical review requested',
    pathwayTimeSensitive: 'Time-sensitive contact',
    pathwayEmergency: 'Emergency action',
    
    emergencyHeading: 'Immediate Emergency Care Needed',
    emergencySubhead: 'If you have chest pain, severe breathlessness, or sudden weakness, call emergency services immediately.',
    emergencyCallNow: 'Call 112 — India',
    emergencyIndependentNotice: 'Emergency guidance operates immediately and independently of AI availability or clinic hours.',
    
    composerPlaceholder: 'Ask a question about your care plan, medications, or recovery...',
    composerSend: 'Ask AVELA',
    composerSuggested: 'Suggested questions',
    composerEmergencyQuick: 'Emergency help',
    
    informationUsed: 'Information used',
    exactRecordedSource: 'Exact recorded instruction',
    verifiedBy: 'Verified by',
    viewFullRecord: 'View source document',
    missingFromRecord: 'Not found in your records',
    
    prepareReviewRequest: 'Prepare Clinician Review',
    reviewSummaryHeading: 'Review & Confirm Request for Your Care Team',
    editBeforeSending: 'You can edit or clarify your notes before sending',
    sendToCareTeam: 'Send request to care team (Simulated)',
    sentInDemo: 'Sent in demo',
    acknowledgedByClinician: 'Acknowledged by care team',
    repliedByClinician: 'Clinician replied',
    
    inboxTitle: 'Triage & Care Inbox',
    morningDigest: 'Morning Digest',
    coverageSettings: 'Coverage & Quiet Hours',
    standingInstructions: 'Care Plan Editor',
    acknowledgeAction: 'Acknowledge',
    replyAction: 'Reply to Patient',
    closeAction: 'Resolve & Close',
    quietHoursActive: 'Quiet Hours Active · Routing to On-Call'
  },
  
  hi: {
    brandTagline: 'आपकी देखभाल, निरंतर।',
    prototypeDisclaimer: 'इंटरएक्टिव प्रोटोटाइप · काल्पनिक रोगी डेटा · सिम्युलेटेड संचार',
    navHome: 'होम',
    navAskAvela: 'AVELA से पूछें',
    navCarePlan: 'मेरी देखभाल योजना',
    navRecords: 'रिकॉर्ड्स',
    navCareTeam: 'केयर टीम',
    navClinicianWorkspace: 'डॉक्टर वर्कस्पेस',
    navSwitchPerspective: 'व्यू बदलें',
    demoControls: 'डेमो सेटिंग्स',
    
    pathwayCarePlan: 'आपकी देखभाल योजना की व्याख्या',
    pathwayClinicalReview: 'डॉक्टर से समीक्षा का अनुरोध',
    pathwayTimeSensitive: 'समय-संवेदनशील संपर्क',
    pathwayEmergency: 'आपातकालीन कार्रवाई',
    
    emergencyHeading: 'तत्काल आपातकालीन चिकित्सा आवश्यक',
    emergencySubhead: 'यदि आपको सीने में दर्द, सांस लेने में अत्यधिक कठिनाई, या अचानक कमजोरी है, तो तुरंत आपातकालीन सेवाओं को कॉल करें।',
    emergencyCallNow: 'अभी 112 पर कॉल करें (भारत)',
    emergencyIndependentNotice: 'आपातकालीन निर्देश AI या क्लिनिक समय से स्वतंत्र तुरंत उपलब्ध हैं।',
    
    composerPlaceholder: 'अपनी देखभाल योजना, दवाओं या स्वास्थ्य पर सवाल पूछें...',
    composerSend: 'पूछें',
    composerSuggested: 'सुझाए गए प्रश्न',
    composerEmergencyQuick: 'आपातकालीन मदद',
    
    informationUsed: 'उपयोग की गई जानकारी',
    exactRecordedSource: 'दस्तावेज़ से सटीक निर्देश',
    verifiedBy: 'द्वारा सत्यापित',
    viewFullRecord: 'पूरा दस्तावेज़ देखें',
    missingFromRecord: 'आपके रिकॉर्ड में उपलब्ध नहीं',
    
    prepareReviewRequest: 'डॉक्टर समीक्षा तैयार करें',
    reviewSummaryHeading: 'डॉक्टर को भेजने से पहले समीक्षा करें',
    editBeforeSending: 'आप भेजने से पहले अपनी बात संपादित कर सकते हैं',
    sendToCareTeam: 'केयर टीम को भेजें (डेमो)',
    sentInDemo: 'डेमो में भेजा गया',
    acknowledgedByClinician: 'डॉक्टर द्वारा देखा गया',
    repliedByClinician: 'डॉक्टर का उत्तर प्राप्त हुआ',
    
    inboxTitle: 'ट्राइएज एवं केयर इनबॉक्स',
    morningDigest: 'मॉर्निंग डाइजेस्ट',
    coverageSettings: 'कवरेज एवं शांत घंटे',
    standingInstructions: 'केयर प्लान एडिटर',
    acknowledgeAction: 'स्वीकार करें',
    replyAction: 'उत्तर दें',
    closeAction: 'बंद करें',
    quietHoursActive: 'शांत घंटे सक्रिय · ऑन-कॉल पर भेजा गया'
  },
  
  te: {
    brandTagline: 'మీ సంరక్షణ, నిరంతరం కొనసాగుతుంది.',
    prototypeDisclaimer: 'ఇంటరాక్టివ్ ప్రోటోటైప్ · కాల్పనిక రోగి సమాచారం · అనుకరణ సమాచారం',
    navHome: 'హోమ్',
    navAskAvela: 'AVELA ని అడగండి',
    navCarePlan: 'నా సంరక్షణ ప్రణాళిక',
    navRecords: 'రికార్డులు',
    navCareTeam: 'వైద్య బృందం',
    navClinicianWorkspace: 'వైద్యుల వర్క్‌స్పేస్',
    navSwitchPerspective: 'వీక్షణ మార్చండి',
    demoControls: 'డెమో నియంత్రణలు',
    
    pathwayCarePlan: 'మీ సంరక్షణ ప్రణాళిక వివరణ',
    pathwayClinicalReview: 'వైద్యుల సమీక్ష కోరబడింది',
    pathwayTimeSensitive: 'సమయ-సున్నితమైన సంప్రదింపు',
    pathwayEmergency: 'అత్యవసర చర్య',
    
    emergencyHeading: 'తక్షణ అత్యవసర వైద్య సంరక్షణ అవసరం',
    emergencySubhead: 'ఛాతీ నొప్పి, తీవ్రమైన శ్వాస తీసుకోవడంలో ఇబ్బంది లేదా ఆకస్మిక బలహీనత ఉంటే వెంటనే అత్యవసర సేవలకు కాల్ చేయండి.',
    emergencyCallNow: 'ఇప్పుడే 112 కి కాల్ చేయండి (భారతదేశం)',
    emergencyIndependentNotice: 'అత్యవసర మార్గదర్శకత్వం AI లభ్యతతో సంబంధం లేకుండా తక్షణమే అందుబాటులో ఉంటుంది.',
    
    composerPlaceholder: 'మీ సంరక్షణ ప్రణాళిక, మందులు లేదా కోలుకోవడం గురించి అడగండి...',
    composerSend: 'అడగండి',
    composerSuggested: 'సూచించిన ప్రశ్నలు',
    composerEmergencyQuick: 'అత్యవసర సహాయం',
    
    informationUsed: 'ఉపయోగించిన సమాచారం',
    exactRecordedSource: 'రికార్డు చేయబడిన ఖచ్చితమైన సూచన',
    verifiedBy: 'ద్వారా ధృవీకరించబడింది',
    viewFullRecord: 'మూల పత్రాన్ని చూడండి',
    missingFromRecord: 'మీ రికార్డులలో కనుగొనబడలేదు',
    
    prepareReviewRequest: 'వైద్య సమీక్షను సిద్ధం చేయండి',
    reviewSummaryHeading: 'వైద్యునికి పంపే ముందు వివరాలను సమీక్షించండి',
    editBeforeSending: 'పంపే ముందు మీరు మీ వివరణను సవరించవచ్చు',
    sendToCareTeam: 'కేర్ టీమ్‌కు పంపండి (డెమో)',
    sentInDemo: 'డెమోలో పంపబడింది',
    acknowledgedByClinician: 'వైద్య బృందం గుర్తించింది',
    repliedByClinician: 'వైద్యులు స్పందించారు',
    
    inboxTitle: 'ట్రయాజ్ మరియు కేర్ ఇన్‌బాక్స్',
    morningDigest: 'మార్నింగ్ డైజెస్ట్',
    coverageSettings: 'కవరేజ్ & నిశ్శబ్ద సమయాలు',
    standingInstructions: 'కేర్ ప్లాన్ ఎడిటర్',
    acknowledgeAction: 'గుర్తించండి',
    replyAction: 'సమాధానం ఇవ్వండి',
    closeAction: 'ముగించండి',
    quietHoursActive: 'నిశ్శబ్ద సమయాలు క్రియాశీలంగా ఉన్నాయి'
  }
}


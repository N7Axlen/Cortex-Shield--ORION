const CONFIG = {
    // API Configuration
    API: {
        BASE_URL: 'http://localhost:5000/api',
        ENDPOINTS: { ANALYZE: '/analyze', HEALTH: '/health' },
        TIMEOUT: 30000,
        HEADERS: { 'Content-Type': 'application/json' }
    },
    // App Settings
    APP: {
        NAME: 'Cortex Shield',
        VERSION: '1.5.0', // Version bump!
        DESCRIPTION: 'AI-Powered Security Toolkit',
        AUTHOR: 'Your Name'
    },
    // UI Settings
    UI: {
        ANIMATION_DURATION: 300,
        TOAST_DURATION: 3000,
        LOADING_MIN_TIME: 1000
    },
    // Storage Keys
    STORAGE: {
        API_KEY: 'cortex_shield_api_key',
        THEME: 'cortex_shield_theme',
        LAST_MODULE: 'cortex_shield_last_module',
        USER_PREFERENCES: 'cortex_shield_preferences'
    },
    // Security Modules Configuration (Vibrant Warm Gradients)
    MODULES: [
        { id: 1, name: 'Universal Threat Analyzer', icon: 'search', description: 'Detect phishing and social engineering in text', placeholder: 'Paste suspicious text or message here...', gradient: 'from-orange-500 to-amber-500', shortDesc: 'Detect threats', category: 'Threat Detection' },
        { id: 2, name: 'Web & URL Risk Assessor', icon: 'globe', description: 'Validate websites/links against structural deception', placeholder: 'Enter URL to analyze (e.g., https://example.com)...', gradient: 'from-amber-400 to-yellow-400', shortDesc: 'Check URLs', category: 'Web Security' },
        { id: 3, name: 'Code Redactor', icon: 'code', description: 'Redact secrets (API keys, passwords) from code', placeholder: 'Paste your code here...', gradient: 'from-orange-400 to-rose-500', shortDesc: 'Redact secrets', category: 'Code Security' },
        { id: 4, name: 'Log Anomaly Hunter', icon: 'file-text', description: 'Translate raw server logs into plain-English threat reports', placeholder: 'Paste server logs here...', gradient: 'from-yellow-400 to-orange-500', shortDesc: 'Analyze logs', category: 'Log Analysis' },
        { id: 5, name: 'Vulnerability Explainer', icon: 'alert-triangle', description: 'Demystify complex code flaws or CVEs with analogies', placeholder: 'Describe the vulnerability or paste code...', gradient: 'from-rose-400 to-pink-500', shortDesc: 'Explain CVEs', category: 'Vulnerability' },
        { id: 6, name: 'Secure File Autopsy', icon: 'file', description: 'Safely analyze documents for embedded malicious content', placeholder: 'Paste document content or describe file...', gradient: 'from-orange-500 to-pink-500', shortDesc: 'Scan files', category: 'File Security' },
        { id: 7, name: 'Data Sanitization Guide', icon: 'database', description: 'Generate OS-specific checklists for wiping personal data', placeholder: 'Specify OS (Windows/Mac/Linux) and data type...', gradient: 'from-amber-500 to-orange-600', shortDesc: 'Wipe data', category: 'Data Privacy' },
        { id: 8, name: 'Secure Password Explainer', icon: 'key', description: 'Generate strong passwords and explain security principles', placeholder: 'Request password generation or ask about security...', gradient: 'from-pink-500 to-purple-500', shortDesc: 'Password help', category: 'Authentication' },
        { id: 9, name: 'Fake News Detector', icon: 'newspaper', description: 'AI-powered fact-checking with multi-source verification', placeholder: 'Paste news article, headline, or claim to fact-check...', gradient: 'from-blue-500 to-cyan-500', shortDesc: 'Fact check', category: 'Misinformation' }
    ],
    // Feature Flags
    FEATURES: {
        ENABLE_API_INTEGRATION: true,
        ENABLE_LOCAL_STORAGE: true,
        DEMO_MODE: false
    },
    // Error & Success Messages
    ERRORS: { INPUT_REQUIRED: 'Please enter some input to analyze.', NETWORK_ERROR: 'Network error. Please check your connection.', SERVER_ERROR: 'Server error. Please try again later.', TIMEOUT_ERROR: 'Request timed out. Please try again.', UNKNOWN_ERROR: 'An unexpected error occurred.' },
    SUCCESS: { ANALYSIS_COMPLETE: 'Analysis completed successfully!', API_KEY_SAVED: 'API key saved successfully.' },
    // Validation Rules
    VALIDATION: { MIN_INPUT_LENGTH: 10, MAX_INPUT_LENGTH: 10000, API_KEY_MIN_LENGTH: 20 }
};
Object.freeze(CONFIG);
if (typeof module !== 'undefined' && module.exports) { module.exports = CONFIG; }
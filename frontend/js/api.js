/**
 * Cortex Shield - API Integration
 * Handles all API calls to backend
 */

class CortexAPI {
    constructor() {
        this.baseURL = CONFIG.API.BASE_URL;
        this.timeout = CONFIG.API.TIMEOUT;
        this.apiKey = this.getStoredApiKey();
    }

    /**
     * Get stored API key from localStorage
     */
    getStoredApiKey() {
        if (CONFIG.FEATURES.ENABLE_LOCAL_STORAGE) {
            return localStorage.getItem(CONFIG.STORAGE.API_KEY) || '';
        }
        return '';
    }

    /**
     * Save API key to localStorage
     */
    saveApiKey(apiKey) {
        if (CONFIG.FEATURES.ENABLE_LOCAL_STORAGE) {
            localStorage.setItem(CONFIG.STORAGE.API_KEY, apiKey);
        }
        this.apiKey = apiKey;
    }

    /**
     * Remove API key from localStorage
     */
    removeApiKey() {
        if (CONFIG.FEATURES.ENABLE_LOCAL_STORAGE) {
            localStorage.removeItem(CONFIG.STORAGE.API_KEY);
        }
        this.apiKey = '';
    }

    /**
     * Check API health
     */
    async checkHealth() {
        try {
            const response = await axios.get(`${this.baseURL}/health`, {
                timeout: this.timeout
            });
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                error: this.handleError(error)
            };
        }
    }

    /**
     * Analyze input with specified module
     */
    async analyze(moduleId, input) {
        try {
            // Validate input
            if (!input || input.trim().length < CONFIG.VALIDATION.MIN_INPUT_LENGTH) {
                throw new Error(CONFIG.ERRORS.INPUT_REQUIRED);
            }

            if (input.length > CONFIG.VALIDATION.MAX_INPUT_LENGTH) {
                throw new Error(`Input too long. Maximum ${CONFIG.VALIDATION.MAX_INPUT_LENGTH} characters.`);
            }

            // Check if in demo mode
            if (CONFIG.FEATURES.DEMO_MODE) {
                return await this.demoAnalyze(moduleId, input);
            }

            // Make API call
            const response = await axios.post(
                `${this.baseURL}${CONFIG.API.ENDPOINTS.ANALYZE}/${moduleId}`,
                { input },
                {
                    timeout: this.timeout,
                    headers: CONFIG.API.HEADERS
                }
            );

            return {
                success: true,
                data: response.data.result,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            return {
                success: false,
                error: this.handleError(error)
            };
        }
    }

    /**
     * Analyze file with specified module
     */
    async analyzeFile(moduleId, file) {
        try {
            // Validate file
            if (!file) {
                throw new Error('No file provided');
            }

            // Check file size (10MB max)
            if (file.size > 10 * 1024 * 1024) {
                throw new Error('File too large. Maximum size is 10MB.');
            }

            // Check if in demo mode
            if (CONFIG.FEATURES.DEMO_MODE) {
                return await this.demoAnalyze(moduleId, `[File: ${file.name}]`);
            }

            // Create FormData
            const formData = new FormData();
            formData.append('file', file);

            // Make API call
            const response = await axios.post(
                `${this.baseURL}${CONFIG.API.ENDPOINTS.ANALYZE}/${moduleId}/upload`,
                formData,
                {
                    timeout: 60000, // 60 seconds for file uploads (VirusTotal can take time)
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            return {
                success: true,
                data: response.data.result,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            return {
                success: false,
                error: this.handleError(error)
            };
        }
    }

    /**
     * Demo mode analysis (returns simulated results)
     */
    async demoAnalyze(moduleId, input) {
        // Simulate network delay
        await this.delay(2000);

        const module = CONFIG.MODULES.find(m => m.id === moduleId);
        
        const demoResponses = {
            1: this.getDemoThreatAnalysis(input),
            2: this.getDemoURLAnalysis(input),
            3: this.getDemoCodeRedaction(input),
            4: this.getDemoLogAnalysis(input),
            5: this.getDemoVulnerabilityExplanation(input),
            6: this.getDemoFileAnalysis(input),
            7: this.getDemoSanitizationGuide(input),
            8: this.getDemoPasswordAdvice(input)
        };

        return {
            success: true,
            data: demoResponses[moduleId] || 'Analysis complete!',
            timestamp: new Date().toISOString(),
            isDemoMode: true
        };
    }

    /**
     * Demo response generators
     */
    getDemoThreatAnalysis(text) {
        return `🔍 THREAT ANALYSIS REPORT

📊 Threat Level: MEDIUM

🚩 Red Flags Identified:
• Urgency language detected
• Suspicious call-to-action patterns
• Potential social engineering indicators

⚠️ Specific Threats:
1. Phishing Attempt Likelihood: 65%
2. Social Engineering Score: 7/10
3. Urgency Manipulation: High

💡 Recommendations:
✓ Do not click any embedded links
✓ Verify sender identity through official channels
✓ Report to security team if received in professional context
✓ Delete message if unsolicited

📝 Analysis Summary:
The analyzed text shows characteristics commonly associated with phishing attempts. The language employs urgency tactics and psychological manipulation techniques.

⏰ Analyzed at: ${new Date().toLocaleString()}
📊 Confidence Score: 85%

🛡️ Stay vigilant and always verify suspicious messages!`;
    }

    getDemoURLAnalysis(url) {
        return `🌐 URL RISK ASSESSMENT

🔗 URL Analyzed: ${url}

📊 Risk Level: LOW-MEDIUM

🔍 Domain Analysis:
• Domain Age: Cannot determine (demo mode)
• SSL Certificate: Check manually
• Reputation Score: Pending verification

⚠️ Potential Deception Indicators:
• Typosquatting check: PASS
• Homograph attack: None detected
• Subdomain depth: Normal

🛡️ Security Recommendations:
✓ Verify the URL matches the intended destination
✓ Check for HTTPS encryption before entering data
✓ Look for trust indicators (padlock icon, certificate)
✓ Be cautious of URL shorteners
✓ Scan with antivirus before downloading files

📝 Summary:
The URL structure appears normal. However, always exercise caution when visiting unfamiliar websites.

🔒 Security Tip: Use browser extensions like uBlock Origin for additional protection.`;
    }

    getDemoCodeRedaction(code) {
        return `🔒 CODE REDACTION REPORT

🔍 Secrets Detection Status: COMPLETE

📝 REDACTED CODE:
\`\`\`
${code.substring(0, 200).replace(/([a-zA-Z0-9]{20,})/g, '***REDACTED***')}
...
\`\`\`

🚨 Secrets Found:
1. API Key detected (Line X) - REDACTED
2. Potential password/token (Line Y) - REDACTED
3. Database connection string (Line Z) - REDACTED

⚠️ Security Recommendations:
✓ Move all secrets to environment variables
✓ Use .env files and add to .gitignore
✓ Implement secret management solutions (HashiCorp Vault, AWS Secrets Manager)
✓ Rotate exposed credentials immediately
✓ Enable two-factor authentication
✓ Use code scanning tools in CI/CD pipeline

🔐 Best Practices:
• Never commit secrets to version control
• Use separate credentials for dev/staging/production
• Implement least-privilege access principles
• Audit secret access regularly

⏰ Scan completed at: ${new Date().toLocaleString()}`;
    }

    getDemoLogAnalysis(logs) {
        return `📊 LOG ANOMALY REPORT

🔍 Analysis Status: COMPLETE

📈 Summary of Findings:
• Total Log Entries Analyzed: ${logs.split('\n').length}
• Anomalies Detected: 3
• Severity: MEDIUM

⚠️ Identified Anomalies:

1. UNUSUAL AUTHENTICATION PATTERN
   • Multiple failed login attempts from same IP
   • Time: Recent activity
   • Risk: Potential brute force attack
   • Action: Monitor and consider IP blocking

2. RESOURCE USAGE SPIKE
   • Abnormal CPU/Memory consumption detected
   • Possible cause: Resource exhaustion attack
   • Recommendation: Investigate process

3. UNCOMMON ACCESS PATTERN
   • Access to sensitive endpoints outside business hours
   • Could indicate: Unauthorized access attempt
   • Status: Requires investigation

🎯 Recommended Actions:
1. Enable rate limiting for authentication endpoints
2. Implement IP-based blocking for repeated failures
3. Set up alerts for off-hours sensitive access
4. Review and update security policies
5. Conduct security audit

📊 Threat Assessment: MEDIUM
🚨 Immediate Action Required: NO (but monitor closely)

⏰ Report generated: ${new Date().toLocaleString()}`;
    }

    getDemoVulnerabilityExplanation(vuln) {
        return `🎓 VULNERABILITY EXPLANATION

📚 Simplified Explanation:
Imagine your house (application) has a mail slot (input field). The vulnerability is like putting your hand through that mail slot and unlocking the door from inside. That's essentially what this security flaw allows attackers to do!

🏠 Real-World Analogy:
Think of it like leaving your car unlocked with the keys in the ignition. While technically the car is "secured" because doors can be locked, anyone who tries the handle can get in and drive away. This vulnerability is similar - it's an unlocked door in your digital security.

⚠️ Why It's Dangerous:
• Allows unauthorized access to sensitive data
• Can be exploited remotely without detection
• May lead to complete system compromise
• Could expose user information
• Enables further attacks on infrastructure

🔧 How to Fix It:
1. Input Validation: Sanitize and validate all user inputs
2. Output Encoding: Properly encode data before display
3. Use Parameterized Queries: Prevent injection attacks
4. Implement Security Headers: Add protective HTTP headers
5. Regular Updates: Keep all dependencies current
6. Security Testing: Conduct regular penetration tests

💡 Prevention Tips:
✓ Follow secure coding practices
✓ Use security frameworks and libraries
✓ Enable security linting tools
✓ Conduct code reviews
✓ Implement defense in depth
✓ Train developers on security

📖 Learn More: OWASP Top 10 Security Risks`;
    }

    getDemoFileAnalysis(content) {
        return `🔍 SECURE FILE AUTOPSY REPORT

📄 Document Analysis: COMPLETE

🛡️ Safety Assessment: CAUTION ADVISED

🔍 Suspicious Elements Found:
1. Embedded Macros Detected
   • Risk Level: HIGH
   • Recommendation: Disable macros before opening

2. External Links Present
   • Count: ${Math.floor(Math.random() * 5) + 1}
   • Some links point to unfamiliar domains
   • Action: Verify before clicking

3. File Metadata Analysis
   • Creation date: Suspicious timing
   • Last modified: Multiple revisions
   • Author: Unknown/Generic

⚠️ Risk Assessment:
• Overall Risk: MEDIUM-HIGH
• Malware Probability: 35%
• Phishing Content: Possible

🚨 Safe Handling Recommendations:
✓ Open in isolated/sandbox environment
✓ Disable macros and active content
✓ Scan with updated antivirus
✓ Verify sender authenticity
✓ Check file hash against known malware databases
✓ Do not enable editing mode immediately
✓ Export to plain text if possible

🔐 Security Checklist:
☐ Scan with antivirus (VirusTotal recommended)
☐ Verify sender identity
☐ Check file extension authenticity
☐ Examine in sandbox environment
☐ Backup system before opening

⚠️ IMPORTANT: When in doubt, delete the file and request a clean copy.`;
    }

    getDemoSanitizationGuide(request) {
        const os = request.toLowerCase().includes('windows') ? 'Windows' : 
                   request.toLowerCase().includes('mac') ? 'macOS' : 'Linux';
        
        return `🗑️ DATA SANITIZATION GUIDE - ${os}

📋 COMPLETE CHECKLIST FOR SECURE DATA WIPING

${os === 'Windows' ? `
🪟 WINDOWS SYSTEMS:

1. Browser Data:
   □ Chrome: Settings → Privacy → Clear browsing data
   □ Edge: Settings → Privacy → Choose what to clear
   □ Firefox: Options → Privacy → Clear History
   
2. System Files:
   □ Run Disk Cleanup (cleanmgr.exe)
   □ Delete temporary files (%temp%)
   □ Clear Windows cache
   □ Empty Recycle Bin
   
3. Applications:
   □ Uninstall unused programs
   □ Clear application caches
   □ Remove saved passwords
   
4. Secure Deletion:
   □ Use SDelete or Eraser tool
   □ Multiple-pass overwrite (DoD 5220.22-M)
   □ Encrypt before deletion for sensitive data

5. Final Steps:
   □ Check for shadow copies
   □ Clear event logs
   □ Reset Windows (if selling device)
` : os === 'macOS' ? `
🍎 macOS SYSTEMS:

1. Browser Data:
   □ Safari: Preferences → Privacy → Manage Website Data
   □ Chrome: Settings → Clear browsing data
   
2. System Files:
   □ Empty Trash securely (Option + Empty Trash)
   □ Clear system cache: ~/Library/Caches
   □ Delete logs: /var/log
   
3. Applications:
   □ Remove app support files: ~/Library/Application Support
   □ Clear preferences: ~/Library/Preferences
   □ Delete login items
   
4. Secure Deletion:
   □ Use 'srm' command for secure removal
   □ FileVault encryption before deletion
   □ Permanent Erase using Disk Utility
   
5. Final Steps:
   □ Sign out of iCloud
   □ Deauthorize iTunes/Music
   □ Erase disk using Recovery Mode (if selling)
` : `
🐧 LINUX SYSTEMS:

1. Browser Data:
   □ Firefox: ~/.mozilla/firefox/
   □ Chrome: ~/.config/google-chrome/
   
2. System Files:
   □ Clear apt cache: sudo apt clean
   □ Remove old logs: sudo journalctl --vacuum-time=3d
   □ Delete temp files: rm -rf /tmp/*
   
3. Applications:
   □ Remove config files: ~/.config/
   □ Clear cache: ~/.cache/
   
4. Secure Deletion:
   □ Use 'shred' command: shred -vfz -n 3 filename
   □ Use 'wipe': wipe -rfi directory/
   □ dd command for entire disk
   
5. Final Steps:
   □ Secure erase: dd if=/dev/zero of=/dev/sdX
   □ DBAN for complete wipe
   □ Verify with disk tools
`}

⚠️ CRITICAL REMINDERS:
• Backup important data before wiping
• Verify backups are complete and accessible
• Sign out of all accounts
• Deauthorize software licenses
• Remove personal information
• Check cloud sync status

🔒 Security Level Recommendations:
• Normal: Single-pass overwrite
• Sensitive: 3-pass overwrite (DoD standard)
• Highly Sensitive: 7-pass overwrite (Gutmann method)

⏰ Estimated Time: 2-6 hours depending on drive size`;
    }

    getDemoPasswordAdvice(request) {
        if (request.toLowerCase().includes('generate')) {
            const password = this.generateSecurePassword();
            return `🔐 SECURE PASSWORD GENERATED

🎯 Generated Password:
${password}

📊 Strength Analysis:
• Length: ${password.length} characters ✓
• Uppercase letters: Yes ✓
• Lowercase letters: Yes ✓
• Numbers: Yes ✓
• Special characters: Yes ✓
• Entropy: High (256-bit)
• Crack time: 1+ trillion years

✨ Why This Password Is Secure:

1. Length: At ${password.length} characters, it exceeds minimum requirements
2. Complexity: Mixes all character types randomly
3. Randomness: Generated using cryptographic random functions
4. Unpredictability: No dictionary words or patterns

🛡️ Password Security Principles:

1. LENGTH MATTERS MOST
   • Minimum 12 characters (16+ recommended)
   • Each additional character exponentially increases security

2. USE UNIQUE PASSWORDS
   • Never reuse passwords across sites
   • Use password manager to track

3. ENABLE 2FA
   • Adds second layer of security
   • Even if password leaked, account stays secure

4. AVOID COMMON MISTAKES
   ✗ Don't use personal information
   ✗ Don't use dictionary words
   ✗ Don't use sequential patterns (123, abc)
   ✗ Don't share passwords
   ✗ Don't write passwords down

5. USE PASSWORD MANAGER
   ✓ LastPass, 1Password, Bitwarden
   ✓ Generate unique passwords
   ✓ Encrypted storage
   ✓ Cross-device sync

💡 Pro Tips:
• Change passwords after suspected breaches
• Use passphrases for memorable security
• Enable biometric authentication when available
• Regular security audits (haveibeenpwned.com)

🔄 Password Rotation:
• Critical accounts: Every 90 days
• Regular accounts: Every 6 months
• Low-risk accounts: Annually`;
        } else {
            return `🎓 PASSWORD SECURITY EDUCATION

📚 Essential Password Principles:

1. LENGTH > COMPLEXITY
   • 16+ character passwords are ideal
   • Longer passwords exponentially harder to crack
   • "correcthorsebatterystaple" > "P@ssw0rd!"

2. PASSWORD MANAGER = ESSENTIAL
   • Generates strong unique passwords
   • Stores them securely encrypted
   • You only remember one master password
   • Recommended: Bitwarden, 1Password, LastPass

3. TWO-FACTOR AUTHENTICATION
   • SMS (better than nothing)
   • Authenticator apps (better - Google Authenticator, Authy)
   • Hardware keys (best - YubiKey)

4. COMMON MYTHS DEBUNKED:
   ✗ "Complex = Secure" - Length matters more
   ✗ "Change monthly" - Causes weak passwords
   ✗ "Write it down" - Digital managers are safer
   ✗ "Browser saves" - Use dedicated manager

5. RED FLAGS:
   🚩 Reusing passwords
   🚩 Using personal information
   🚩 Dictionary words
   🚩 Sequential characters
   🚩 Sharing passwords

6. BEST PRACTICES:
   ✅ Unique password per service
   ✅ 16+ characters minimum
   ✅ Use password manager
   ✅ Enable 2FA everywhere
   ✅ Regular security audits
   ✅ Check for breaches (haveibeenpwned.com)

💡 Quick Security Wins:
1. Install password manager TODAY
2. Enable 2FA on email (most critical)
3. Change weak passwords
4. Never reuse passwords
5. Use biometrics when available

🔐 Remember: Your password is the key to your digital life. Treat it like you would your house keys!`;
        }
    }

    /**
     * Generate secure random password
     */
    generateSecurePassword(length = 20) {
        const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const lowercase = 'abcdefghijklmnopqrstuvwxyz';
        const numbers = '0123456789';
        const special = '!@#$%^&*()_+-=[]{}|;:,.<>?';
        const all = uppercase + lowercase + numbers + special;

        let password = '';
        password += uppercase[Math.floor(Math.random() * uppercase.length)];
        password += lowercase[Math.floor(Math.random() * lowercase.length)];
        password += numbers[Math.floor(Math.random() * numbers.length)];
        password += special[Math.floor(Math.random() * special.length)];

        for (let i = password.length; i < length; i++) {
            password += all[Math.floor(Math.random() * all.length)];
        }

        return password.split('').sort(() => Math.random() - 0.5).join('');
    }

    /**
     * Delay helper for demo mode
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Handle API errors
     */
    handleError(error) {
        if (error.response) {
            // Server responded with error
            return error.response.data.error || CONFIG.ERRORS.SERVER_ERROR;
        } else if (error.request) {
            // Request made but no response
            return CONFIG.ERRORS.NETWORK_ERROR;
        } else if (error.code === 'ECONNABORTED') {
            // Timeout
            return CONFIG.ERRORS.TIMEOUT_ERROR;
        } else {
            // Other errors
            return error.message || CONFIG.ERRORS.UNKNOWN_ERROR;
        }
    }
}

// Create global API instance
const cortexAPI = new CortexAPI();
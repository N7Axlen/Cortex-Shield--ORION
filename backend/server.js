/**
 * CORTEX SHIELD - ENHANCED BACKEND SERVER v2.0
 * - Gemini 2.5 Pro Integration
 * - VirusTotal API Integration
 * - File Upload Support (Images, Documents, Logs)
 * - Image Analysis with Gemini Vision
 * - Simplified Output for Non-Technical Users
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const axios = require('axios');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Configuration
const GEMINI_API_KEY = 'AIzaSyAqgcQunpx9KRVU1NvSZtyGPON-V237R2g';
const VIRUSTOTAL_API_KEY = 'f134adeabeb30bb407efab1b95bef404185b14cfeca688caa32115931887820c';
const GEMINI_MODEL = 'gemini-2.0-flash-exp'; // Using Gemini 2.5 Pro

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        // Accept images, text files, logs, documents
        const allowedTypes = /jpeg|jpg|png|gif|webp|txt|log|pdf|doc|docx|csv|json|xml/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype) || file.mimetype.startsWith('text/');
        
        if (extname || mimetype) {
            return cb(null, true);
        } else {
            cb(new Error('Only images, text files, logs, and documents are allowed'));
        }
    }
});

// Middleware
app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// Request logging
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});

// ==============================================
// SIMPLIFIED OUTPUT FORMATTER
// ==============================================
function simplifyOutput(rawOutput, category) {
    // Extract key information and present it in a simple, friendly way
    const simplified = {
        summary: '',
        severity: '',
        findings: [],
        recommendations: [],
        details: rawOutput
    };

    // Simple severity detection
    if (rawOutput.toLowerCase().includes('critical') || rawOutput.toLowerCase().includes('dangerous')) {
        simplified.severity = '🔴 Critical';
    } else if (rawOutput.toLowerCase().includes('high') || rawOutput.toLowerCase().includes('suspicious')) {
        simplified.severity = '🟠 High Risk';
    } else if (rawOutput.toLowerCase().includes('medium') || rawOutput.toLowerCase().includes('caution')) {
        simplified.severity = '🟡 Medium Risk';
    } else {
        simplified.severity = '🟢 Low Risk / Safe';
    }

    return simplified;
}

// ==============================================
// GEMINI AI ANALYSIS (TEXT)
// ==============================================
async function analyzeWithGemini(prompt) {
    try {
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
            {
                contents: [{
                    parts: [{ text: prompt }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 3072
                }
            },
            { timeout: 60000 }
        );

        if (response.data.candidates && response.data.candidates[0]?.content?.parts[0]?.text) {
            return {
                success: true,
                result: response.data.candidates[0].content.parts[0].text
            };
        } else {
            return {
                success: false,
                error: 'Invalid response from AI'
            };
        }
    } catch (error) {
        console.error('Gemini API Error:', error.message);
        return {
            success: false,
            error: error.message
        };
    }
}

// ==============================================
// GEMINI VISION ANALYSIS (IMAGES)
// ==============================================
async function analyzeImageWithGemini(imagePath, prompt) {
    try {
        const imageBuffer = fs.readFileSync(imagePath);
        const base64Image = imageBuffer.toString('base64');
        const ext = path.extname(imagePath).toLowerCase();
        
        let mimeType = 'image/jpeg';
        if (ext === '.png') mimeType = 'image/png';
        if (ext === '.gif') mimeType = 'image/gif';
        if (ext === '.webp') mimeType = 'image/webp';

        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
            {
                contents: [{
                    parts: [
                        { text: prompt },
                        {
                            inline_data: {
                                mime_type: mimeType,
                                data: base64Image
                            }
                        }
                    ]
                }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 3072
                }
            },
            { timeout: 60000 }
        );

        if (response.data.candidates && response.data.candidates[0]?.content?.parts[0]?.text) {
            return {
                success: true,
                result: response.data.candidates[0].content.parts[0].text
            };
        } else {
            return {
                success: false,
                error: 'Invalid response from AI'
            };
        }
    } catch (error) {
        console.error('Gemini Vision API Error:', error.message);
        return {
            success: false,
            error: error.message
        };
    }
}

// ==============================================
// VIRUSTOTAL INTEGRATION
// ==============================================
async function scanWithVirusTotal(content, type = 'url') {
    try {
        if (type === 'url') {
            // URL scan
            const formData = new FormData();
            formData.append('url', content);

            const response = await axios.post(
                'https://www.virustotal.com/api/v3/urls',
                formData,
                {
                    headers: {
                        'x-apikey': VIRUSTOTAL_API_KEY,
                        ...formData.getHeaders()
                    }
                }
            );

            // Get analysis results
            const analysisId = response.data.data.id;
            await new Promise(resolve => setTimeout(resolve, 15000)); // Wait 15 seconds

            const analysisResponse = await axios.get(
                `https://www.virustotal.com/api/v3/analyses/${analysisId}`,
                {
                    headers: { 'x-apikey': VIRUSTOTAL_API_KEY }
                }
            );

            const stats = analysisResponse.data.data.attributes.stats;
            return {
                success: true,
                malicious: stats.malicious || 0,
                suspicious: stats.suspicious || 0,
                harmless: stats.harmless || 0,
                undetected: stats.undetected || 0,
                total: (stats.malicious || 0) + (stats.suspicious || 0) + (stats.harmless || 0) + (stats.undetected || 0)
            };
        } else if (type === 'file') {
            // File scan
            const formData = new FormData();
            formData.append('file', fs.createReadStream(content));

            const response = await axios.post(
                'https://www.virustotal.com/api/v3/files',
                formData,
                {
                    headers: {
                        'x-apikey': VIRUSTOTAL_API_KEY,
                        ...formData.getHeaders()
                    },
                    maxContentLength: Infinity,
                    maxBodyLength: Infinity
                }
            );

            const analysisId = response.data.data.id;
            await new Promise(resolve => setTimeout(resolve, 20000)); // Wait 20 seconds

            const analysisResponse = await axios.get(
                `https://www.virustotal.com/api/v3/analyses/${analysisId}`,
                {
                    headers: { 'x-apikey': VIRUSTOTAL_API_KEY }
                }
            );

            const stats = analysisResponse.data.data.attributes.stats;
            return {
                success: true,
                malicious: stats.malicious || 0,
                suspicious: stats.suspicious || 0,
                harmless: stats.harmless || 0,
                undetected: stats.undetected || 0,
                total: (stats.malicious || 0) + (stats.suspicious || 0) + (stats.harmless || 0) + (stats.undetected || 0)
            };
        }
    } catch (error) {
        console.error('VirusTotal API Error:', error.message);
        return {
            success: false,
            error: error.message
        };
    }
}

// ==============================================
// ENHANCED PROMPTS FOR SIMPLIFIED OUTPUT
// ==============================================
const SIMPLIFIED_PROMPTS = {
    1: (text) => `Analyze this message for security threats. Be ACCURATE - only flag actual threats, not normal messages.

Message:
${text}

Response format (be concise, 2-3 sentences max per section):
**Safe?** Clear Yes/No/Maybe
**Why?** Brief explanation
**Action:** What to do (if unsafe)

Be direct. Don't overreact to normal messages.`,

    2: (text) => `Check this URL for security issues. Be REALISTIC - legitimate sites are usually safe.

URL:
${text}

Brief response (2-3 sentences max):
**Safe?** Yes/No/Caution
**Reasoning:** Quick assessment
**Advice:** Action if needed

Only flag actual red flags.`,

    3: (text) => `Find secrets in this code. Be brief.

Code:
${text}

**Found?** Yes/No
**What:** List them
**Fix:** How to secure them

Keep it short.`,

    4: (text) => `Check these logs for issues. Don't overcomplicate.

Logs:
${text}

**Status:** OK/Issues
**Found:** Main findings (if any)
**Action:** What to do

2-3 sentences max.`,

    5: (text) => `Explain this security issue simply.

Issue:
${text}

**Problem:** What it is (1 sentence)
**Risk:** Why it matters (1 sentence)
**Fix:** Solution (brief)

No jargon.`,

    6: (text) => `Check this file for safety. Be concise.

Content:
${text}

**Safe?** Yes/No/Caution
**Reason:** Why
**Action:** Next steps (if unsafe)

Short and clear.`,

    7: (text) => `Data deletion guide. Keep it practical.

Request:
${text}

**Goal:** What we're doing
**Steps:** 3-5 numbered steps
**Note:** Key tip

Be direct.`,

    8: (text) => `Password advice. Be brief and helpful.

Question:
${text}

**Answer:** Direct response
**Tip:** Best practice (1-2 lines)

Keep it simple.`,

    9: (text) => `🔍 FAKE NEWS & MISINFORMATION DETECTION 🔍

CLAIM/NEWS TO FACT-CHECK:
${text}

Perform comprehensive fact-checking analysis:

**🔍 VERDICT**: [TRUE / PARTIALLY TRUE / MISLEADING / FALSE / UNVERIFIABLE]

**📊 CREDIBILITY SCORE**: [0-100%] with reasoning

**✅ VERIFIED FACTS**:
- [List confirmed accurate information]
- [Provide context for each]

**❌ FALSE/MISLEADING CLAIMS**:
- [List inaccuracies with corrections]
- [Explain why they're wrong]

**⚠️ RED FLAGS DETECTED**:
- [Sensationalism, emotional manipulation, etc.]
- [Lack of credible sources]
- [Logical fallacies or inconsistencies]
- [Other warning signs]

**🔎 RECOMMENDED VERIFICATION SOURCES**:
- Fact-checkers: Snopes.com, FactCheck.org, PolitiFact.com, FullFact.org
- Official sources relevant to the claim
- Academic or scientific institutions if applicable

**🎯 KEY CLAIMS BREAKDOWN**:
[Analyze each major claim individually with evidence]

**💡 FINAL VERDICT**:
[4-5 sentence comprehensive conclusion about reliability, confidence level, and recommendation]

Be thorough, unbiased, evidence-based, and cite specific reasons for your assessment.`
};

// ==============================================
// ROUTES
// ==============================================

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Cortex Shield API v2.0 is running',
        features: ['Gemini 2.5 Pro', 'VirusTotal', 'File Upload', 'Image Analysis']
    });
});

// Text analysis endpoint (original functionality)
app.post('/api/analyze/:moduleId', async (req, res) => {
    const { moduleId } = req.params;
    const { input } = req.body;

    if (!input || input.trim().length === 0) {
        return res.status(400).json({
            success: false,
            error: 'Please provide some text to analyze'
        });
    }

    const moduleIdNum = parseInt(moduleId);
    if (isNaN(moduleIdNum) || !SIMPLIFIED_PROMPTS[moduleIdNum]) {
        return res.status(400).json({
            success: false,
            error: 'Invalid module selected'
        });
    }

    console.log(`\n📊 Analyzing text with Module ${moduleIdNum}...`);

    // For URL module, also run VirusTotal
    if (moduleIdNum === 2) {
        console.log('🔍 Running VirusTotal scan...');
        const vtResult = await scanWithVirusTotal(input.trim(), 'url');
        
        const aiResult = await analyzeWithGemini(SIMPLIFIED_PROMPTS[moduleIdNum](input.trim()));
        
        if (aiResult.success) {
            let combinedResult = aiResult.result;
            
            if (vtResult.success) {
                combinedResult += `\n\n🛡️ **VirusTotal Scan Results:**\n`;
                combinedResult += `✓ Scanned by ${vtResult.total} security engines\n`;
                if (vtResult.malicious > 0) {
                    combinedResult += `🔴 ${vtResult.malicious} engines detected this as MALICIOUS\n`;
                }
                if (vtResult.suspicious > 0) {
                    combinedResult += `🟠 ${vtResult.suspicious} engines found it suspicious\n`;
                }
                if (vtResult.malicious === 0 && vtResult.suspicious === 0) {
                    combinedResult += `🟢 No threats detected by any engine\n`;
                }
            }
            
            return res.json({
                success: true,
                result: combinedResult
            });
        } else {
            return res.status(500).json(aiResult);
        }
    } else {
        const result = await analyzeWithGemini(SIMPLIFIED_PROMPTS[moduleIdNum](input.trim()));
        return res.json(result);
    }
});

// File upload and analysis endpoint
app.post('/api/analyze/:moduleId/upload', upload.single('file'), async (req, res) => {
    const { moduleId } = req.params;
    const moduleIdNum = parseInt(moduleId);

    if (!req.file) {
        return res.status(400).json({
            success: false,
            error: 'Please upload a file'
        });
    }

    console.log(`\n📁 File uploaded: ${req.file.originalname}`);
    console.log(`📏 Size: ${(req.file.size / 1024).toFixed(2)} KB`);
    console.log(`📋 Type: ${req.file.mimetype}`);

    const filePath = req.file.path;
    const isImage = req.file.mimetype.startsWith('image/');

    try {
        let result;

        if (isImage) {
            // Image analysis with Gemini Vision
            console.log('🖼️ Analyzing image with Gemini Vision...');
            const imagePrompt = `You are a friendly security assistant. Analyze this image for any security concerns, suspicious content, or potential threats. 

Provide a SIMPLE, EASY-TO-UNDERSTAND response:
1. **What's in the image?** (Describe what you see)
2. **Any concerns?** (Security issues, scams, phishing attempts, etc.)
3. **Is it safe?** (Yes/No/Be Careful)
4. **What should I do?** (Clear advice)

Use everyday language and be helpful!`;

            result = await analyzeImageWithGemini(filePath, imagePrompt);

            // If it's module 6 (File Autopsy), also scan with VirusTotal
            if (moduleIdNum === 6) {
                console.log('🔍 Running VirusTotal scan on image...');
                const vtResult = await scanWithVirusTotal(filePath, 'file');
                
                if (vtResult.success && result.success) {
                    result.result += `\n\n🛡️ **VirusTotal Scan Results:**\n`;
                    result.result += `✓ Scanned by ${vtResult.total} antivirus engines\n`;
                    if (vtResult.malicious > 0) {
                        result.result += `🔴 ${vtResult.malicious} engines detected threats\n`;
                    } else {
                        result.result += `🟢 No threats detected\n`;
                    }
                }
            }
        } else {
            // Text file analysis
            console.log('📄 Reading text file...');
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            
            if (fileContent.trim().length === 0) {
                return res.status(400).json({
                    success: false,
                    error: 'The file appears to be empty'
                });
            }

            // Use the appropriate prompt based on module
            const prompt = SIMPLIFIED_PROMPTS[moduleIdNum](fileContent);
            result = await analyzeWithGemini(prompt);

            // For module 6, also scan with VirusTotal
            if (moduleIdNum === 6) {
                console.log('🔍 Running VirusTotal scan on file...');
                const vtResult = await scanWithVirusTotal(filePath, 'file');
                
                if (vtResult.success && result.success) {
                    result.result += `\n\n🛡️ **VirusTotal Scan Results:**\n`;
                    result.result += `✓ Scanned by ${vtResult.total} antivirus engines\n`;
                    if (vtResult.malicious > 0) {
                        result.result += `🔴 ${vtResult.malicious} engines detected threats\n`;
                    } else {
                        result.result += `🟢 No threats detected\n`;
                    }
                }
            }
        }

        // Clean up uploaded file
        fs.unlinkSync(filePath);
        console.log('✓ Analysis complete, file cleaned up');

        return res.json(result);

    } catch (error) {
        // Clean up file on error
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        console.error('Error processing file:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to process file: ' + error.message
        });
    }
});

// Batch VirusTotal URL scan
app.post('/api/virustotal/url', async (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({
            success: false,
            error: 'URL is required'
        });
    }

    console.log(`\n🔍 VirusTotal URL scan: ${url}`);
    const result = await scanWithVirusTotal(url, 'url');
    return res.json(result);
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Endpoint not found'
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        success: false,
        error: err.message || 'Internal server error'
    });
});

// Start server
app.listen(PORT, () => {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🛡️  CORTEX SHIELD v2.0 - Enhanced Edition');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📡 Server: http://localhost:${PORT}`);
    console.log(`🤖 AI Model: ${GEMINI_MODEL}`);
    console.log(`🔑 Gemini API: Configured`);
    console.log(`🛡️ VirusTotal API: Configured`);
    console.log(`📁 File Upload: Enabled (10MB limit)`);
    console.log(`🖼️ Image Analysis: Enabled`);
    console.log(`📤 Upload Directory: ${uploadsDir}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✓ Ready to protect! 🚀');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
});

# 🛡️ Cortex Shield - AI-Powered Security Toolkit

A stunning, feature-rich security analysis platform powered by Google's Gemini AI. Analyze threats, validate URLs, redact secrets, and more with beautiful visual effects and professional UI.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)

---

## 📁 Complete Project Structure

```
cortex-shield/
├── frontend/
│   ├── index.html                 # Main HTML entry point
│   ├── css/
│   │   └── styles.css            # Custom CSS with animations
│   └── js/
│       ├── config.js             # App configuration
│       ├── particles.js          # Particle animation system
│       ├── api.js                # API integration layer
│       ├── modules.js            # Module management
│       ├── ui.js                 # UI components & rendering
│       └── app.js                # Main application logic
│
├── backend/
│   ├── server.js                 # Express server with Gemini API
│   ├── package.json              # Backend dependencies
│   └── .env                      # Environment variables (create this)
│
├── .gitignore
└── README.md                     # This file
```

---

## 🚀 Quick Start Guide

### Prerequisites

- **Node.js** v18+ ([Download](https://nodejs.org/))
- **npm** or **yarn**
- **Google Gemini API Key** ([Get one here](https://makersuite.google.com/app/apikey))
- **Git** ([Download](https://git-scm.com/))

### Installation Steps

#### 1️⃣ Clone or Create Project

```bash
# Create project directory
mkdir cortex-shield
cd cortex-shield

# Create subdirectories
mkdir frontend backend
mkdir frontend/css frontend/js
```

#### 2️⃣ Setup Backend

```bash
cd backend

# Initialize npm
npm init -y

# Install dependencies
npm install express cors helmet axios dotenv body-parser

# Install dev dependencies
npm install --save-dev nodemon
```

Create `package.json` scripts:
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

Create `.env` file:
```env
PORT=5000
GEMINI_API_KEY=your_actual_api_key_here
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

Copy the `server.js` file I provided earlier into `backend/server.js`.

#### 3️⃣ Setup Frontend

```bash
cd ../frontend
```

1. Copy the `index.html` file into `frontend/`
2. Copy `styles.css` into `frontend/css/`
3. Copy all JavaScript files into `frontend/js/`:
   - config.js
   - particles.js
   - api.js
   - modules.js
   - ui.js
   - app.js

#### 4️⃣ Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
# Option 1: Use Python
python -m http.server 3000

# Option 2: Use Node.js http-server
npx http-server -p 3000

# Option 3: Use VS Code Live Server extension
# Just right-click index.html and select "Open with Live Server"
```

#### 5️⃣ Access Application

Open your browser and navigate to:
```
http://localhost:3000
```

---

## 🎨 Features

### 8 Security Modules

1. **Universal Threat Analyzer** - Detect phishing and social engineering
2. **Web & URL Risk Assessor** - Validate websites for security risks
3. **Code Redactor** - Automatically redact API keys and secrets
4. **Log Anomaly Hunter** - Analyze server logs for threats
5. **Vulnerability Explainer** - Learn about security flaws
6. **Secure File Autopsy** - Analyze documents for malicious content
7. **Data Sanitization Guide** - OS-specific data wiping instructions
8. **Secure Password Explainer** - Generate and learn about passwords

### Visual Effects

- ✨ Floating particle animations
- 🌈 Dynamic gradient backgrounds
- 💫 Glassmorphism design
- 🎭 3D card tilt effects
- ⚡ Smooth page transitions
- 🔮 Hover glow effects
- 📊 Real-time statistics
- 🎪 Grid pattern overlays

---

## 🔧 Configuration

### Frontend Configuration (`js/config.js`)

```javascript
const CONFIG = {
    API: {
        BASE_URL: 'http://localhost:5000/api', // Change for production
        TIMEOUT: 30000
    },
    FEATURES: {
        DEMO_MODE: true, // Set to false when backend is ready
        ENABLE_LOCAL_STORAGE: true,
        ENABLE_ANALYTICS: false
    }
    // ... more settings
};
```

### Backend Configuration (`.env`)

```env
PORT=5000
GEMINI_API_KEY=your_key_here
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

---

## 📡 API Endpoints

### Backend API

```
GET  /health
     Returns server status

POST /api/analyze/:moduleId
     Body: { "input": "text to analyze" }
     Returns: { "success": true, "result": "..." }

GET  /api/history
     Returns analysis history (future feature)
```

---

## 🎯 Usage Examples

### Analyzing Phishing Text

1. Open Cortex Shield
2. Select "Universal Threat Analyzer"
3. Paste suspicious text
4. Click "Analyze with AI"
5. Review threat assessment

### Redacting Code Secrets

1. Select "Code Redactor"
2. Paste code with secrets
3. Get redacted version + security tips

---

## 🌐 Deployment

### Frontend Deployment (Vercel)

```bash
cd frontend
vercel --prod
```

Set environment variable:
- `REACT_APP_API_URL` = your backend URL

### Backend Deployment (Render)

1. Push code to GitHub
2. Create new Web Service on Render
3. Set environment variables:
   - `GEMINI_API_KEY`
   - `FRONTEND_URL`
   - `NODE_ENV=production`
4. Deploy!

### Alternative: Railway

Deploy both frontend and backend on Railway.app:
```bash
railway login
railway init
railway up
```

---

## 🔐 Security Best Practices

1. **Never commit `.env` files**
   ```bash
   echo ".env" >> .gitignore
   ```

2. **Use HTTPS in production**
   - Enable SSL/TLS certificates
   - Update CORS settings

3. **Implement rate limiting**
   ```javascript
   npm install express-rate-limit
   ```

4. **Validate all inputs**
   - Already implemented in server.js

5. **Keep dependencies updated**
   ```bash
   npm audit
   npm update
   ```

---

## 🐛 Troubleshooting

### Backend won't start

```bash
# Check if port is in use
lsof -i :5000

# Kill process
kill -9 <PID>

# Or use different port in .env
PORT=5001
```

### CORS errors

Update `server.js`:
```javascript
app.use(cors({
    origin: 'http://localhost:3000', // Your frontend URL
    credentials: true
}));
```

### API key errors

1. Verify key in `.env` file
2. Check key is valid at [AI Studio](https://makersuite.google.com/)
3. Restart backend server

### Frontend not loading

1. Check console for errors (F12)
2. Verify all JS files are loaded
3. Check network tab for failed requests
4. Clear browser cache

---

## 📊 Performance Tips

1. **Lazy load modules** (future optimization)
2. **Implement caching** for repeated analyses
3. **Use CDN** for production assets
4. **Minimize bundle size** with webpack
5. **Enable gzip compression** on server

---

## 🎓 Development Tips

### Using Browser Console

```javascript
// Check app version
cortex.version()

// View configuration
cortex.config()

// Get statistics
cortex.stats()

// Clear history
cortex.clearHistory()

// Export history
cortex.exportHistory()

// Reset app
cortex.reset()

// Show help
cortex.help()
```

### Hot Reload Setup

Backend:
```bash
npm install -g nodemon
nodemon server.js
```

Frontend:
```bash
# Use Live Server extension in VS Code
# Or watch mode with any static server
```

---

## 📦 Building for Production

### Optimize Frontend

1. Minify CSS and JS
2. Compress images
3. Enable caching headers
4. Use CDN for libraries

### Optimize Backend

1. Use PM2 for process management
   ```bash
   npm install -g pm2
   pm2 start server.js
   ```

2. Enable clustering
3. Add Redis for caching
4. Implement load balancing

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📝 License

MIT License - feel free to use for personal or commercial projects

---

## 🙏 Acknowledgments

- **Google Gemini AI** - AI analysis engine
- **Tailwind CSS** - Styling framework
- **Lucide Icons** - Beautiful icons
- **Express.js** - Backend framework

---

## 📞 Support

Having issues? Check:

1. [GitHub Issues](https://github.com/yourusername/cortex-shield/issues)
2. [Documentation](https://github.com/yourusername/cortex-shield/wiki)
3. [Discord Community](https://discord.gg/yourserver)

---

## 🗺️ Roadmap

- [ ] User authentication (Firebase)
- [ ] Database integration (MongoDB)
- [ ] Export reports as PDF
- [ ] Real-time collaboration
- [ ] Mobile app version
- [ ] More AI models (GPT-4, Claude)
- [ ] Custom security rules
- [ ] API rate limiting
- [ ] Analytics dashboard
- [ ] Dark/Light theme toggle

---

## 📈 Version History

### v1.0.0 (Current)
- Initial release
- 9 security modules
- Gemini AI integration
- Beautiful UI with animations
- Demo mode support

---

**Built with ❤️ for security professionals and enthusiasts**

*Star ⭐ this repo if you find it helpful!*

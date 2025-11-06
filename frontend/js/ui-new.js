class UIManager {
    constructor() {
        this.appContainer = document.getElementById('app');
        this.currentView = 'dashboard';
        this.selectedFile = null;
        this.currentModuleId = null;
        this.currentTheme = localStorage.getItem('cortex_theme') || 'default';
        this.applyTheme(this.currentTheme);
    }

    applyTheme(theme) {
        console.log('Applying theme:', theme);
        
        // Get or create the theme stylesheet link
        let themeLink = document.getElementById('theme-stylesheet');
        if (!themeLink) {
            themeLink = document.createElement('link');
            themeLink.id = 'theme-stylesheet';
            themeLink.rel = 'stylesheet';
            document.head.appendChild(themeLink);
        }
        
        // Update the theme CSS file
        const themePath = `css/themes/${theme}.css`;
        console.log('Loading theme file:', themePath);
        themeLink.href = themePath;
        
        // Save preference
        this.currentTheme = theme;
        localStorage.setItem('cortex_theme', theme);
        
        console.log('Theme applied successfully');
    }

    setTheme(theme) {
        this.applyTheme(theme);
        
        // Update active state on theme buttons
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-theme-btn="${theme}"]`)?.classList.add('active');
        
        // Show toast notification
        this.showToast(`Switched to ${theme.charAt(0).toUpperCase() + theme.slice(1)} mode`);
    }

    showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'fixed bottom-6 right-6 px-6 py-3 rounded-xl bg-slate-900/95 backdrop-blur-xl border border-white/10 text-white shadow-2xl z-50 animate-fade-in';
        toast.innerHTML = `
            <div class="flex items-center gap-3">
                <i data-lucide="check-circle" class="w-5 h-5 text-green-400"></i>
                <span>${message}</span>
            </div>
        `;
        document.body.appendChild(toast);
        lucide.createIcons();
        
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(20px)';
            toast.style.transition = 'all 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 2500);
    }

    renderApp() {
        this.appContainer.innerHTML = `
            <div class="flex h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
                <!-- Sidebar -->
                <aside class="w-72 bg-slate-900/50 backdrop-blur-xl border-r border-white/10 flex flex-col">
                    <!-- Logo -->
                    <div class="p-6 border-b border-white/10">
                        <div class="flex items-center gap-3 mb-2">
                            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/50">
                                <i data-lucide="shield-check" class="w-6 h-6 text-white"></i>
                            </div>
                            <div>
                                <h1 class="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Cortex Shield</h1>
                                <p class="text-xs text-gray-400">Security Analysis Suite</p>
                            </div>
                        </div>
                    </div>

                    <!-- Navigation -->
                    <nav class="flex-1 p-4 overflow-y-auto">
                        <div class="mb-2 px-2">
                            <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Analysis Modules</p>
                        </div>
                        ${CONFIG.MODULES.map(m => `
                            <button onclick="uiManager.selectModule(${m.id})" id="nav-module-${m.id}" 
                                class="nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all mb-1 text-left hover:bg-white/5 group">
                                <div class="w-8 h-8 rounded-lg bg-gradient-to-br ${m.gradient} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                    <i data-lucide="${m.icon}" class="w-4 h-4 text-white"></i>
                                </div>
                                <div class="flex-1 min-w-0">
                                    <p class="text-sm font-medium text-gray-300 group-hover:text-white transition-colors truncate">${m.name}</p>
                                    <p class="text-xs text-gray-500 truncate">${m.shortDesc || 'Security tool'}</p>
                                </div>
                            </button>
                        `).join('')}
                    </nav>

                    <!-- Footer -->
                    <div class="p-4 border-t border-white/10">
                        <div class="flex items-center gap-2 text-xs text-gray-400">
                            <div class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                            <span>AI Systems Online</span>
                        </div>
                    </div>
                </aside>

                <!-- Main Content -->
                <main class="flex-1 flex flex-col overflow-hidden">
                    <!-- Top Bar -->
                    <header class="h-16 bg-slate-900/30 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-6">
                        <div class="flex items-center gap-4">
                            <h2 id="page-title" class="text-lg font-semibold text-white">Welcome</h2>
                            <span id="module-badge" class="hidden px-3 py-1 rounded-full text-xs font-medium"></span>
                        </div>
                        <div class="flex items-center gap-3">
                            <button type="button" onclick="uiManager.showHistory()" class="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-sm text-gray-300 transition-all flex items-center gap-2">
                                <i data-lucide="clock" class="w-4 h-4"></i>
                                History
                            </button>
                            <button class="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-all">
                                <i data-lucide="settings" class="w-5 h-5 text-gray-300"></i>
                            </button>
                        </div>
                    </header>

                    <!-- Content Area -->
                    <div id="content-area" class="flex-1 overflow-y-auto p-6">
                        ${this.renderWelcomeScreen()}
                    </div>
                </main>
            </div>
        `;
        
        lucide.createIcons();
    }

    renderWelcomeScreen() {
        return `
            <div class="max-w-4xl mx-auto">
                <div class="text-center mb-12">
                    <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 mb-6 shadow-2xl shadow-indigo-500/50">
                        <i data-lucide="shield-check" class="w-10 h-10 text-white"></i>
                    </div>
                    <h1 class="text-4xl font-bold text-white mb-3">Welcome to Cortex Shield</h1>
                    <p class="text-gray-400 text-lg">Advanced AI-powered security analysis at your fingertips</p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div class="p-6 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20">
                        <div class="w-12 h-12 rounded-lg bg-indigo-500/20 flex items-center justify-center mb-4">
                            <i data-lucide="zap" class="w-6 h-6 text-indigo-400"></i>
                        </div>
                        <h3 class="text-white font-semibold mb-2">AI-Powered Analysis</h3>
                        <p class="text-sm text-gray-400">Gemini 2.5 Pro for intelligent threat detection</p>
                    </div>
                    <div class="p-6 rounded-xl bg-gradient-to-br from-pink-500/10 to-purple-500/10 border border-pink-500/20">
                        <div class="w-12 h-12 rounded-lg bg-pink-500/20 flex items-center justify-center mb-4">
                            <i data-lucide="shield" class="w-6 h-6 text-pink-400"></i>
                        </div>
                        <h3 class="text-white font-semibold mb-2">VirusTotal Integration</h3>
                        <p class="text-sm text-gray-400">70+ antivirus engines scanning</p>
                    </div>
                    <div class="p-6 rounded-xl bg-gradient-to-br from-teal-500/10 to-cyan-500/10 border border-teal-500/20">
                        <div class="w-12 h-12 rounded-lg bg-teal-500/20 flex items-center justify-center mb-4">
                            <i data-lucide="image" class="w-6 h-6 text-teal-400"></i>
                        </div>
                        <h3 class="text-white font-semibold mb-2">Multi-Format Support</h3>
                        <p class="text-sm text-gray-400">Images, documents, code, logs & more</p>
                    </div>
                </div>

                <div class="p-8 rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-white/10 backdrop-blur-xl">
                    <h3 class="text-xl font-bold text-white mb-4">Quick Start</h3>
                    <ol class="space-y-3 text-gray-300">
                        <li class="flex items-start gap-3">
                            <span class="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-sm font-semibold">1</span>
                            <span>Select a security module from the sidebar</span>
                        </li>
                        <li class="flex items-start gap-3">
                            <span class="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-sm font-semibold">2</span>
                            <span>Enter text or upload a file for analysis</span>
                        </li>
                        <li class="flex items-start gap-3">
                            <span class="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-sm font-semibold">3</span>
                            <span>Get instant AI-powered security insights</span>
                        </li>
                    </ol>
                </div>
            </div>
        `;
    }

    selectModule(moduleId) {
        this.currentModuleId = moduleId;
        const module = CONFIG.MODULES.find(m => m.id === moduleId);
        moduleManager.setCurrentModule(moduleId);
        
        // Update active state
        document.querySelectorAll('.nav-item').forEach(el => {
            el.classList.remove('bg-white/10', 'border-l-2', 'border-indigo-500');
        });
        document.getElementById(`nav-module-${moduleId}`).classList.add('bg-white/10', 'border-l-2', 'border-indigo-500');
        
        // Update header
        document.getElementById('page-title').textContent = module.name;
        const badge = document.getElementById('module-badge');
        badge.textContent = module.category || 'Security Tool';
        badge.className = 'px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/20 text-indigo-300 border border-indigo-500/30';
        badge.classList.remove('hidden');
        
        // Render module interface
        this.renderModuleInterface(module);
    }

    renderModuleInterface(module) {
        const supportsFileUpload = [1, 3, 4, 5, 6].includes(module.id);
        const supportsImageUpload = [1, 6].includes(module.id);
        const hasVirusTotal = [2, 6].includes(module.id);
        
        const contentArea = document.getElementById('content-area');
        contentArea.innerHTML = `
            <div class="max-w-6xl mx-auto">
                <!-- Module Info Card -->
                <div class="mb-6 p-6 rounded-xl bg-gradient-to-r ${module.gradient} relative overflow-hidden">
                    <div class="absolute inset-0 bg-black/40"></div>
                    <div class="relative flex items-center gap-4">
                        <div class="w-16 h-16 rounded-xl bg-white/20 backdrop-blur-xl flex items-center justify-center">
                            <i data-lucide="${module.icon}" class="w-8 h-8 text-white"></i>
                        </div>
                        <div class="flex-1">
                            <h2 class="text-2xl font-bold text-white mb-1">${module.name}</h2>
                            <p class="text-white/80">${module.description}</p>
                        </div>
                        ${hasVirusTotal ? '<div class="px-4 py-2 rounded-lg bg-purple-500/30 backdrop-blur-xl border border-white/30 text-white text-sm font-medium">🛡️ VirusTotal Enabled</div>' : ''}
                    </div>
                </div>

                <!-- Analysis Interface -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <!-- Input Panel -->
                    <div class="space-y-4">
                        <div class="p-6 rounded-xl bg-slate-900/50 backdrop-blur-xl border border-white/10">
                            <div class="flex items-center justify-between mb-4">
                                <h3 class="text-lg font-semibold text-white">Input</h3>
                                ${supportsFileUpload ? `
                                <div class="flex gap-2">
                                    <button id="text-mode" class="mode-btn active px-4 py-2 rounded-lg text-sm font-medium transition-all">
                                        <i data-lucide="type" class="w-4 h-4 inline mr-1"></i> Text
                                    </button>
                                    <button id="file-mode" class="mode-btn px-4 py-2 rounded-lg text-sm font-medium transition-all">
                                        <i data-lucide="upload" class="w-4 h-4 inline mr-1"></i> File
                                    </button>
                                </div>` : ''}
                            </div>

                            <!-- Text Input -->
                            <div id="text-input">
                                <textarea id="input-textarea" placeholder="${module.placeholder}" 
                                    class="w-full h-96 p-4 rounded-lg bg-slate-800/50 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/50 transition-all resize-none font-mono text-sm"></textarea>
                            </div>

                            <!-- File Upload -->
                            ${supportsFileUpload ? `
                            <div id="file-input" class="hidden">
                                <div id="drop-zone" class="relative h-96 border-2 border-dashed border-white/20 rounded-lg flex flex-col items-center justify-center p-8 cursor-pointer transition-all hover:border-indigo-500 hover:bg-indigo-500/5">
                                    <input type="file" id="file-input-element" class="hidden" accept="${supportsImageUpload ? 'image/*,.pdf,.doc,.docx,.txt,.log,.csv,.json,.xml' : '.pdf,.doc,.docx,.txt,.log,.csv,.json,.xml'}">
                                    <div id="upload-prompt">
                                        <div class="w-20 h-20 rounded-full bg-indigo-500/10 flex items-center justify-center mx-auto mb-4">
                                            <i data-lucide="upload-cloud" class="w-10 h-10 text-indigo-400"></i>
                                        </div>
                                        <p class="text-white font-medium mb-2">Drop your file here</p>
                                        <p class="text-gray-400 text-sm mb-4">or click to browse</p>
                                        <p class="text-xs text-gray-500">${supportsImageUpload ? 'Images, Documents, Logs' : 'Documents, Logs'} • Max 10MB</p>
                                    </div>
                                    <div id="file-preview" class="hidden w-full">
                                        <img id="preview-img" class="max-h-64 rounded-lg mx-auto mb-4">
                                        <div class="bg-slate-800/50 rounded-lg p-4">
                                            <div class="flex items-center justify-between">
                                                <div class="flex items-center gap-3">
                                                    <div class="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                                                        <i data-lucide="file" class="w-5 h-5 text-indigo-400"></i>
                                                    </div>
                                                    <div>
                                                        <p id="file-name" class="text-white font-medium text-sm"></p>
                                                        <p id="file-size" class="text-gray-400 text-xs"></p>
                                                    </div>
                                                </div>
                                                <button id="remove-file" class="w-8 h-8 rounded-lg bg-red-500/20 hover:bg-red-500/30 flex items-center justify-center transition-all">
                                                    <i data-lucide="x" class="w-4 h-4 text-red-400"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>` : ''}

                            <button id="analyze-btn" class="mt-4 w-full py-4 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-lg shadow-lg shadow-indigo-500/50 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                                <i data-lucide="zap" class="w-5 h-5"></i>
                                <span>Analyze</span>
                            </button>
                        </div>
                    </div>

                    <!-- Output Panel -->
                    <div class="p-6 rounded-xl bg-slate-900/40 backdrop-blur-xl border border-white/10">
                        <div class="flex items-center justify-between mb-4">
                            <h3 class="text-lg font-semibold text-white">Results</h3>
                            <button type="button" id="copy-btn" disabled class="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-sm text-gray-400 transition-all flex items-center gap-2 disabled:opacity-30">
                                <i data-lucide="copy" class="w-4 h-4"></i>
                                Copy
                            </button>
                        </div>
                        <div id="output" class="h-[28rem] p-4 rounded-lg bg-slate-800/50 border border-white/10 overflow-y-auto">
                            <div class="h-full flex items-center justify-center text-gray-500">
                                <div class="text-center">
                                    <i data-lucide="activity" class="w-12 h-12 mx-auto mb-3 text-gray-600"></i>
                                    <p>Analysis results will appear here</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        lucide.createIcons();
        this.setupModuleListeners(supportsFileUpload, supportsImageUpload);
    }

    setupModuleListeners(supportsFileUpload, supportsImageUpload) {
        const analyzeBtn = document.getElementById('analyze-btn');
        const copyBtn = document.getElementById('copy-btn');
        
        analyzeBtn.addEventListener('click', () => this.handleAnalyze());
        copyBtn.addEventListener('click', () => this.copyResult());
        
        if (supportsFileUpload) {
            const textMode = document.getElementById('text-mode');
            const fileMode = document.getElementById('file-mode');
            const textInput = document.getElementById('text-input');
            const fileInput = document.getElementById('file-input');
            
            textMode.addEventListener('click', () => {
                textMode.classList.add('active', 'bg-indigo-500/20', 'text-indigo-300', 'border', 'border-indigo-500/30');
                fileMode.classList.remove('active', 'bg-indigo-500/20', 'text-indigo-300', 'border', 'border-indigo-500/30');
                fileMode.classList.add('text-gray-400');
                textInput.classList.remove('hidden');
                fileInput.classList.add('hidden');
                this.selectedFile = null;
            });
            
            fileMode.addEventListener('click', () => {
                fileMode.classList.add('active', 'bg-indigo-500/20', 'text-indigo-300', 'border', 'border-indigo-500/30');
                textMode.classList.remove('active', 'bg-indigo-500/20', 'text-indigo-300', 'border', 'border-indigo-500/30');
                textMode.classList.add('text-gray-400');
                fileInput.classList.remove('hidden');
                textInput.classList.add('hidden');
            });
            
            this.setupFileUpload(supportsImageUpload);
        }
    }

    setupFileUpload(supportsImageUpload) {
        const dropZone = document.getElementById('drop-zone');
        const fileInputElement = document.getElementById('file-input-element');
        const uploadPrompt = document.getElementById('upload-prompt');
        const filePreview = document.getElementById('file-preview');
        const previewImg = document.getElementById('preview-img');
        const fileName = document.getElementById('file-name');
        const fileSize = document.getElementById('file-size');
        const removeBtn = document.getElementById('remove-file');
        
        // Simple click handler to open file dialog
        dropZone.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Drop zone clicked - opening file browser');
            
            // Use setTimeout to ensure click happens outside event handler
            setTimeout(() => {
                fileInputElement.click();
                console.log('File input clicked');
            }, 10);
        }, false);
        
        fileInputElement.onchange = (e) => {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            console.log('File input changed:', e.target.files);
            if (e.target.files && e.target.files.length > 0) {
                this.handleFileSelect(e.target.files[0]);
            }
            return false;
        };
        
        dropZone.ondragover = (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropZone.classList.add('border-indigo-500', 'bg-indigo-500/10');
            return false;
        };
        
        dropZone.ondragleave = (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropZone.classList.remove('border-indigo-500', 'bg-indigo-500/10');
            return false;
        };
        
        dropZone.ondrop = (e) => {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            console.log('File dropped');
            dropZone.classList.remove('border-indigo-500', 'bg-indigo-500/10');
            if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                this.handleFileSelect(e.dataTransfer.files[0]);
            }
            return false;
        };
        
        removeBtn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            this.selectedFile = null;
            fileInputElement.value = '';
            uploadPrompt.classList.remove('hidden');
            filePreview.classList.add('hidden');
            lucide.createIcons();
            return false;
        };
    }

    handleFileSelect(file) {
        if (file.size > 10 * 1024 * 1024) {
            alert('File too large! Maximum size is 10MB.');
            return;
        }
        
        this.selectedFile = file;
        const uploadPrompt = document.getElementById('upload-prompt');
        const filePreview = document.getElementById('file-preview');
        const previewImg = document.getElementById('preview-img');
        const fileName = document.getElementById('file-name');
        const fileSize = document.getElementById('file-size');
        
        uploadPrompt.classList.add('hidden');
        filePreview.classList.remove('hidden');
        
        fileName.textContent = file.name;
        fileSize.textContent = this.formatFileSize(file.size);
        
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                previewImg.src = e.target.result;
                previewImg.classList.remove('hidden');
            };
            reader.readAsDataURL(file);
        } else {
            previewImg.classList.add('hidden');
        }
        
        lucide.createIcons();
    }

    formatFileSize(bytes) {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    }

    async handleAnalyze(e) {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
        }
        
        console.log('=== handleAnalyze START ===');
        const textInput = document.getElementById('input-textarea');
        const input = textInput ? textInput.value : '';
        const analyzeBtn = document.getElementById('analyze-btn');
        const output = document.getElementById('output');
        const copyBtn = document.getElementById('copy-btn');
        
        const hasTextInput = input.trim().length > 0;
        const hasFileInput = this.selectedFile !== null;
        
        console.log('Has text:', hasTextInput, 'Has file:', hasFileInput, 'File:', this.selectedFile);
        
        if (!hasTextInput && !hasFileInput) {
            alert('Please enter text or upload a file to analyze.');
            return false;
        }

        analyzeBtn.disabled = true;
        analyzeBtn.innerHTML = `<div class="loading-spinner"></div><span>Analyzing...</span>`;
        
        const module = moduleManager.currentModule;
        const hasVirusTotal = [2, 6].includes(module.id);
        
        output.innerHTML = `
            <div class="h-full flex items-center justify-center">
                <div class="text-center">
                    <div class="loading-spinner mb-4 mx-auto"></div>
                    <p class="text-white font-medium mb-2">${hasVirusTotal ? '🛡️ Scanning with VirusTotal...' : '🤖 Analyzing with Gemini AI...'}</p>
                    ${hasVirusTotal ? '<p class="text-gray-400 text-sm">This may take 15-20 seconds</p>' : ''}
                </div>
            </div>
        `;

        let result;
        try {
            if (hasFileInput) {
                console.log('📁 Calling analyzeFile API...');
                result = await cortexAPI.analyzeFile(module.id, this.selectedFile);
            } else {
                console.log('📝 Calling analyze API...');
                result = await cortexAPI.analyze(module.id, input);
            }
            console.log('✅ API call completed:', result);
        } catch (error) {
            console.error('❌ API call failed:', error);
            result = { success: false, error: error.message || 'Unknown error' };
        }

        analyzeBtn.disabled = false;
        analyzeBtn.innerHTML = `<i data-lucide="zap" class="w-5 h-5"></i><span>Analyze</span>`;
        lucide.createIcons();

        if (result.success) {
            console.log('✅ Analysis successful, displaying results');
            this.displayResult(result.data);
            
            // Save to history
            const inputToSave = hasFileInput ? `[File: ${this.selectedFile.name}]` : input;
            this.saveToHistory(module, inputToSave, result.data);
            console.log('💾 Saved to history');
            
            copyBtn.disabled = false;
            copyBtn.classList.remove('opacity-30');
            copyBtn.classList.add('hover:bg-white/10');
            
            console.log('='.repeat(60));
            console.log('✅ ANALYSIS COMPLETED SUCCESSFULLY');
            console.log('='.repeat(60) + '\n');
        } else {
            console.log('❌ Analysis failed:', result.error);
            output.innerHTML = `
                <div class="p-4 rounded-lg bg-red-500/10 border border-red-500/30">
                    <div class="flex items-center gap-2 text-red-400 font-medium mb-2">
                        <i data-lucide="alert-circle" class="w-5 h-5"></i>
                        Error
                    </div>
                    <p class="text-gray-300">${result.error}</p>
                </div>
            `;
            lucide.createIcons();
            console.log('='.repeat(60));
            console.log('❌ ANALYSIS FAILED');
            console.log('='.repeat(60) + '\n');
        }
    }

    displayResult(data) {
        const output = document.getElementById('output');
        let formattedText = data
            .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
            .replace(/^### (.+)$/gm, '<h3 class="text-lg font-bold text-indigo-300 mt-4 mb-2">$1</h3>')
            .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold text-indigo-200 mt-4 mb-2">$1</h2>')
            .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold text-white mt-4 mb-2">$1</h1>')
            .replace(/^- (.+)$/gm, '<li class="ml-4 mb-1 text-gray-300">• $1</li>')
            .replace(/^(\d+)\. (.+)$/gm, '<li class="ml-4 mb-1 text-gray-300">$1. $2</li>')
            .replace(/🟢/g, '<span class="inline-block text-2xl">🟢</span>')
            .replace(/🟡/g, '<span class="inline-block text-2xl">🟡</span>')
            .replace(/🟠/g, '<span class="inline-block text-2xl">🟠</span>')
            .replace(/🔴/g, '<span class="inline-block text-2xl">🔴</span>')
            .replace(/\n\n/g, '<br><br>')
            .replace(/\n/g, '<br>');
        
        output.innerHTML = `<div class="formatted-result text-gray-300 leading-relaxed">${formattedText}</div>`;
        output.scrollTop = 0;
    }

    copyResult() {
        const text = document.getElementById('output').textContent;
        navigator.clipboard.writeText(text);
        
        const copyBtn = document.getElementById('copy-btn');
        const originalHTML = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i data-lucide="check" class="w-4 h-4"></i><span>Copied!</span>';
        copyBtn.classList.add('text-green-400');
        lucide.createIcons();
        
        setTimeout(() => {
            copyBtn.innerHTML = originalHTML;
            copyBtn.classList.remove('text-green-400');
            lucide.createIcons();
        }, 2000);
    }

    showHistory() {
        alert('History feature coming soon!');
    }

    showSettings() {
        this.showThemeMenu();
    }

    saveToHistory(module, input, result) {
        // Save to sessionStorage
        const history = JSON.parse(sessionStorage.getItem('cortex_history') || '[]');
        history.unshift({
            id: Date.now(),
            module: module.name,
            moduleId: module.id,
            input: input.substring(0, 100),
            result: result.substring(0, 200),
            timestamp: new Date().toISOString()
        });
        // Keep last 50 entries
        sessionStorage.setItem('cortex_history', JSON.stringify(history.slice(0, 50)));
    }
}

const uiManager = new UIManager();

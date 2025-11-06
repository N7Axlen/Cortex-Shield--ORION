class UIManager {
    constructor() {
        this.appContainer = document.getElementById('app');
        this.currentView = 'dashboard';
        this.selectedFile = null;
    }

    renderLoginScreen() {
        this.currentView = 'login';
        this.appContainer.innerHTML = `
            <div class="relative min-h-screen flex items-center justify-center p-4">
                <div class="max-w-md w-full">
                    <div class="glass-effect rounded-2xl shadow-2xl p-8 border border-cyan-400/20 hover-lift">
                        <div class="flex items-center justify-center mb-6">
                            <div class="w-20 h-20 bg-cyan-400/10 border border-cyan-400/20 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(0,217,255,0.4)]">
                                <i data-lucide="shield" class="w-10 h-10 text-cyan-400"></i>
                            </div>
                        </div>
                        <h1 class="font-display text-4xl font-bold text-center mb-2 gradient-text">Cortex Shield</h1>
                        <p class="text-gray-400 text-center mb-8">AI-Powered Security Toolkit</p>
                        
                        <div class="space-y-4">
                            <input
                                type="password" id="api-key-input" placeholder="Enter API key or press Enter for demo..."
                                class="w-full px-4 py-3 bg-[#151933] border border-cyan-400/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/50 transition-all font-mono"
                            />
                            <button id="init-button" class="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-3 rounded-lg font-bold text-lg shadow-[0_0_20px_rgba(0,217,255,0.4)] transition-all flex items-center justify-center gap-2 btn-ripple">
                                <i data-lucide="zap" class="w-5 h-5"></i>
                                <span>Initialize Shield</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>`;
        lucide.createIcons();
        document.getElementById('api-key-input').addEventListener('keypress', (e) => e.key === 'Enter' && this.handleLogin());
        document.getElementById('init-button').addEventListener('click', () => this.handleLogin());
    }

    renderDashboard() {
        this.currentView = 'dashboard';
        this.appContainer.innerHTML = `
            <div class="relative p-6">
                <div class="max-w-7xl mx-auto">
                    <header class="flex items-center justify-between mb-12 fade-in">
                        <div class="flex items-center gap-4">
                            <div class="w-16 h-16 bg-cyan-400/10 border border-cyan-400/20 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(0,217,255,0.4)]">
                                <i data-lucide="shield" class="w-8 h-8 text-cyan-400"></i>
                            </div>
                            <div>
                                <h1 class="font-display text-4xl font-bold gradient-text">Cortex Shield</h1>
                                <p class="text-gray-400">Select a security module to begin analysis</p>
                            </div>
                        </div>
                        <button id="settings-button" class="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-colors">Settings</button>
                    </header>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        ${CONFIG.MODULES.map((m, i) => this.renderModuleCard(m, i)).join('')}
                    </div>
                </div>
            </div>`;
        lucide.createIcons();
        document.getElementById('settings-button').addEventListener('click', () => this.renderLoginScreen());
        CONFIG.MODULES.forEach(m => document.getElementById(`module-${m.id}`).addEventListener('click', () => this.renderModuleView(m.id)));
    }

    renderModuleCard(module, index) {
        return `
            <button id="module-${module.id}" class="group glass-effect rounded-xl p-6 border border-cyan-400/20 hover:border-cyan-400/50 transition-all duration-300 hover-lift text-left slide-in-left" style="animation-delay: ${index * 0.05}s">
                <div class="bg-gradient-to-r ${module.gradient} p-3 rounded-lg inline-block mb-4 shadow-lg group-hover:scale-110 transition-transform">
                    <i data-lucide="${module.icon}" class="w-6 h-6 text-white"></i>
                </div>
                <h3 class="font-display text-xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">${module.name}</h3>
                <p class="text-sm text-gray-400 leading-relaxed">${module.description}</p>
            </button>`;
    }

    renderModuleView(moduleId) {
        const module = moduleManager.setCurrentModule(moduleId);
        this.currentView = 'module';
        
        // Check which features this module supports
        const supportsFileUpload = [1, 3, 4, 5, 6].includes(moduleId); // Threat, Code, Log, Vuln, File
        const supportsImageUpload = [1, 6].includes(moduleId); // Threat, File Autopsy
        const hasVirusTotal = [2, 6].includes(moduleId); // URL Scanner, File Autopsy
        
        this.appContainer.innerHTML = `
            <div class="relative max-w-6xl mx-auto p-6">
                <button id="back-button" class="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6 group">
                    <i data-lucide="arrow-left" class="w-4 h-4 group-hover:-translate-x-1 transition-transform"></i>
                    <span>Back to Dashboard</span>
                </button>
                <div class="flex items-center gap-4 mb-8 glass-effect rounded-xl p-6 border border-cyan-400/20">
                    <div class="bg-gradient-to-r ${module.gradient} p-4 rounded-lg shadow-lg">
                        <i data-lucide="${module.icon}" class="w-10 h-10 text-white"></i>
                    </div>
                    <div class="flex-1">
                        <h2 class="font-display text-3xl font-bold text-white">${module.name}</h2>
                        <p class="text-gray-400">${module.description}</p>
                    </div>
                    ${hasVirusTotal ? '<div class="bg-purple-500/20 border border-purple-400/30 px-3 py-1 rounded-lg text-xs text-purple-300 font-semibold">🛡️ VirusTotal</div>' : ''}
                </div>
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <!-- Input Panel -->
                    <div class="glass-effect rounded-xl p-6 border border-orange-400/20 slide-in-left">
                        <h3 class="font-display text-xl font-bold text-white mb-4 gradient-text">Input Data</h3>
                        
                        <!-- Tab Switcher -->
                        <div class="flex gap-2 mb-4">
                            <button id="text-tab" class="tab-button active flex-1 py-2 px-4 rounded-lg bg-orange-500/20 border border-orange-400/30 text-orange-300 font-semibold transition-all">
                                📝 Text
                            </button>
                            ${supportsFileUpload ? `
                            <button id="file-tab" class="tab-button flex-1 py-2 px-4 rounded-lg bg-white/5 border border-white/10 text-gray-400 font-semibold transition-all hover:bg-white/10">
                                📁 File
                            </button>` : ''}
                        </div>
                        
                        <!-- Text Input -->
                        <div id="text-input-panel">
                            <textarea id="input-textarea" placeholder="${module.placeholder}" class="w-full h-80 p-4 bg-[#2d1b3d] border border-orange-400/30 rounded-lg text-white placeholder-[#a389a3] focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/30 smooth-transition resize-none font-mono text-sm"></textarea>
                        </div>
                        
                        <!-- File Upload -->
                        ${supportsFileUpload ? `
                        <div id="file-input-panel" class="hidden">
                            <!-- Drop Zone -->
                            <div id="drop-zone" class="relative border-2 border-dashed border-orange-400/30 rounded-lg p-8 text-center transition-all hover:border-orange-400/60 hover:bg-orange-500/5 cursor-pointer">
                                <input type="file" id="file-input" class="hidden" accept="${supportsImageUpload ? 'image/*,.pdf,.doc,.docx,.txt,.log,.csv,.json,.xml' : '.pdf,.doc,.docx,.txt,.log,.csv,.json,.xml'}">
                                <div id="drop-zone-content">
                                    <i data-lucide="upload" class="w-12 h-12 text-orange-400 mx-auto mb-3"></i>
                                    <p class="text-white font-semibold mb-1">Drag & drop file here</p>
                                    <p class="text-gray-400 text-sm mb-3">or click to browse</p>
                                    <p class="text-xs text-gray-500">
                                        ${supportsImageUpload ? 'Images, Documents, Text Files' : 'Documents, Text Files'} • Max 10MB
                                    </p>
                                </div>
                                <div id="file-preview" class="hidden">
                                    <img id="preview-image" class="max-h-64 mx-auto rounded-lg mb-3">
                                    <div id="file-info" class="text-left bg-[#2d1b3d] rounded-lg p-3">
                                        <p class="text-white font-semibold truncate" id="file-name"></p>
                                        <p class="text-gray-400 text-sm" id="file-size"></p>
                                    </div>
                                    <button id="remove-file" class="mt-3 text-red-400 hover:text-red-300 text-sm flex items-center gap-1 mx-auto">
                                        <i data-lucide="x" class="w-4 h-4"></i>
                                        Remove file
                                    </button>
                                </div>
                            </div>
                        </div>` : ''}
                        
                        <button id="analyze-button" class="mt-4 w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white py-3 rounded-lg font-bold text-lg glow-primary smooth-transition flex items-center justify-center gap-2 btn-ripple disabled:opacity-50 disabled:cursor-not-allowed">
                            <i data-lucide="zap" class="w-5 h-5"></i>
                            <span>Analyze</span>
                        </button>
                    </div>
                    
                    <!-- Output Panel -->
                    <div class="glass-effect rounded-xl p-6 border border-orange-400/20 slide-in-right">
                        <h3 class="font-display text-xl font-bold text-white mb-4 gradient-text">Analysis Result</h3>
                        <div id="output-container" class="w-full h-80 p-4 bg-[#2d1b3d] border border-orange-400/30 rounded-lg text-[#fff5f0] overflow-y-auto font-sans text-sm">
                            <div class="flex items-center justify-center h-full text-[#a389a3]">Results will appear here...</div>
                        </div>
                        <button id="copy-button" class="mt-4 w-full bg-gradient-to-r from-orange-500/10 to-amber-500/10 hover:from-orange-500/20 hover:to-amber-500/20 text-orange-300 py-3 rounded-lg font-semibold smooth-transition flex items-center justify-center gap-2 opacity-50 pointer-events-none border border-orange-400/20" disabled>
                            <i data-lucide="copy" class="w-4 h-4"></i>
                            <span>Copy Result</span>
                        </button>
                    </div>
                </div>
            </div>`;
        lucide.createIcons();
        
        // Event Listeners
        document.getElementById('back-button').addEventListener('click', () => this.renderDashboard());
        document.getElementById('analyze-button').addEventListener('click', () => this.handleAnalyze());
        document.getElementById('copy-button').addEventListener('click', () => this.copyResult());
        
        // Tab switching
        const textTab = document.getElementById('text-tab');
        const fileTab = document.getElementById('file-tab');
        const textPanel = document.getElementById('text-input-panel');
        const filePanel = document.getElementById('file-input-panel');
        
        if (supportsFileUpload && fileTab && filePanel) {
            textTab.addEventListener('click', () => {
                textTab.classList.add('active', 'bg-orange-500/20', 'border-orange-400/30', 'text-orange-300');
                textTab.classList.remove('bg-white/5', 'border-white/10', 'text-gray-400');
                fileTab.classList.remove('active', 'bg-orange-500/20', 'border-orange-400/30', 'text-orange-300');
                fileTab.classList.add('bg-white/5', 'border-white/10', 'text-gray-400');
                textPanel.classList.remove('hidden');
                filePanel.classList.add('hidden');
                this.selectedFile = null;
            });
            
            fileTab.addEventListener('click', () => {
                fileTab.classList.add('active', 'bg-orange-500/20', 'border-orange-400/30', 'text-orange-300');
                fileTab.classList.remove('bg-white/5', 'border-white/10', 'text-gray-400');
                textTab.classList.remove('active', 'bg-orange-500/20', 'border-orange-400/30', 'text-orange-300');
                textTab.classList.add('bg-white/5', 'border-white/10', 'text-gray-400');
                filePanel.classList.remove('hidden');
                textPanel.classList.add('hidden');
            });
            
            this.setupFileUpload(supportsImageUpload);
        }
    }

    handleLogin() {
        const apiKey = document.getElementById('api-key-input').value.trim();
        if (apiKey) cortexAPI.saveApiKey(apiKey);
        this.renderDashboard();
    }

    setupFileUpload(supportsImageUpload) {
        this.selectedFile = null;
        const dropZone = document.getElementById('drop-zone');
        const fileInput = document.getElementById('file-input');
        const dropZoneContent = document.getElementById('drop-zone-content');
        const filePreview = document.getElementById('file-preview');
        const previewImage = document.getElementById('preview-image');
        const fileName = document.getElementById('file-name');
        const fileSize = document.getElementById('file-size');
        const removeBtn = document.getElementById('remove-file');
        
        // Click to upload
        dropZone.addEventListener('click', (e) => {
            if (e.target.id !== 'remove-file' && !e.target.closest('#remove-file')) {
                fileInput.click();
            }
        });
        
        // File selected via input
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.handleFileSelect(e.target.files[0], supportsImageUpload);
            }
        });
        
        // Drag and drop
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('border-orange-400', 'bg-orange-500/10');
        });
        
        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('border-orange-400', 'bg-orange-500/10');
        });
        
        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('border-orange-400', 'bg-orange-500/10');
            
            if (e.dataTransfer.files.length > 0) {
                this.handleFileSelect(e.dataTransfer.files[0], supportsImageUpload);
            }
        });
        
        // Remove file
        if (removeBtn) {
            removeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.selectedFile = null;
                fileInput.value = '';
                dropZoneContent.classList.remove('hidden');
                filePreview.classList.add('hidden');
                lucide.createIcons();
            });
        }
    }
    
    handleFileSelect(file, supportsImageUpload) {
        const dropZoneContent = document.getElementById('drop-zone-content');
        const filePreview = document.getElementById('file-preview');
        const previewImage = document.getElementById('preview-image');
        const fileName = document.getElementById('file-name');
        const fileSize = document.getElementById('file-size');
        
        // Validate file size (10MB)
        if (file.size > 10 * 1024 * 1024) {
            alert('File too large! Maximum size is 10MB.');
            return;
        }
        
        this.selectedFile = file;
        
        // Show preview
        dropZoneContent.classList.add('hidden');
        filePreview.classList.remove('hidden');
        
        fileName.textContent = file.name;
        fileSize.textContent = this.formatFileSize(file.size);
        
        // Show image preview if it's an image
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                previewImage.src = e.target.result;
                previewImage.classList.remove('hidden');
            };
            reader.readAsDataURL(file);
        } else {
            previewImage.classList.add('hidden');
        }
        
        lucide.createIcons();
    }
    
    formatFileSize(bytes) {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    }

    async handleAnalyze() {
        const textInput = document.getElementById('input-textarea');
        const input = textInput ? textInput.value : '';
        const button = document.getElementById('analyze-button');
        const output = document.getElementById('output-container');
        const copyButton = document.getElementById('copy-button');
        
        // Check if we have file or text input
        const hasTextInput = input.trim().length > 0;
        const hasFileInput = this.selectedFile !== null;
        
        if (!hasTextInput && !hasFileInput) {
            alert('Please enter text or upload a file to analyze.');
            return;
        }

        button.disabled = true;
        button.innerHTML = `<div class="loading-spinner"></div><span>Analyzing...</span>`;
        
        // Show VirusTotal message if applicable
        const module = moduleManager.currentModule;
        const hasVirusTotal = [2, 6].includes(module.id);
        if (hasVirusTotal) {
            output.innerHTML = '<div class="flex flex-col items-center justify-center h-full text-gray-400"><div class="loading-spinner mb-3"></div><p>🛡️ Scanning with VirusTotal...</p><p class="text-xs text-gray-500 mt-2">This may take 15-20 seconds</p></div>';
        } else {
            output.innerHTML = '<div class="flex flex-col items-center justify-center h-full text-gray-400"><div class="loading-spinner mb-3"></div><p>🤖 Analyzing with Gemini AI...</p></div>';
        }

        let result;
        if (hasFileInput) {
            result = await cortexAPI.analyzeFile(module.id, this.selectedFile);
        } else {
            result = await cortexAPI.analyze(module.id, input);
        }

        button.disabled = false;
        button.innerHTML = `<i data-lucide="zap" class="w-5 h-5"></i><span>Analyze</span>`;
        lucide.createIcons();

        if (result.success) {
            this.displayFormattedResult(result.data);
            copyButton.disabled = false;
            copyButton.classList.remove('opacity-50', 'pointer-events-none');
            moduleManager.addToHistory(module.id, hasFileInput ? `[File: ${this.selectedFile.name}]` : input, result.data);
        } else {
            output.innerHTML = `<div class="p-4 text-red-400 bg-red-900/20 border border-red-500/30 rounded-lg">
                <div class="font-semibold mb-2">❌ Error</div>
                <div>${result.error}</div>
            </div>`;
        }
    }
    
    displayFormattedResult(data) {
        const output = document.getElementById('output-container');
        
        // Convert markdown-like formatting to HTML for better display
        let formattedText = data
            .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white">$1</strong>') // Bold
            .replace(/^### (.+)$/gm, '<h3 class="text-lg font-bold text-orange-300 mt-4 mb-2">$1</h3>') // Headers
            .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold text-orange-200 mt-4 mb-2">$1</h2>')
            .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold text-white mt-4 mb-2">$1</h1>')
            .replace(/^- (.+)$/gm, '<li class="ml-4 mb-1">• $1</li>') // Bullet lists
            .replace(/^(\d+)\. (.+)$/gm, '<li class="ml-4 mb-1">$1. $2</li>') // Numbered lists
            .replace(/🟢/g, '<span class="text-green-400 text-xl">🟢</span>') // Safety indicators
            .replace(/🟡/g, '<span class="text-yellow-400 text-xl">🟡</span>')
            .replace(/🟠/g, '<span class="text-orange-400 text-xl">🟠</span>')
            .replace(/🔴/g, '<span class="text-red-400 text-xl">🔴</span>')
            .replace(/\n\n/g, '<br><br>') // Paragraphs
            .replace(/\n/g, '<br>'); // Line breaks
        
        output.innerHTML = `<div class="formatted-result">${formattedText}</div>`;
        output.scrollTop = 0; // Scroll to top
    }

    copyResult() {
        const text = document.getElementById('output-container').textContent;
        navigator.clipboard.writeText(text);
        
        // Show feedback
        const copyButton = document.getElementById('copy-button');
        const originalHTML = copyButton.innerHTML;
        copyButton.innerHTML = '<i data-lucide="check" class="w-4 h-4"></i><span>Copied!</span>';
        lucide.createIcons();
        
        setTimeout(() => {
            copyButton.innerHTML = originalHTML;
            lucide.createIcons();
        }, 2000);
    }
}

const uiManager = new UIManager();
class LandingPage {
    constructor() {
        this.appContainer = document.getElementById('app');
    }

    render() {
        this.appContainer.innerHTML = `
            <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
                <!-- Animated Background Elements -->
                <div class="absolute inset-0 opacity-20">
                    <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500 rounded-full filter blur-3xl animate-pulse"></div>
                    <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl animate-pulse" style="animation-delay: 1s;"></div>
                </div>

                <!-- Main Content -->
                <div class="relative z-10 text-center px-6 max-w-4xl">
                    <!-- Logo Animation -->
                    <div class="mb-8 animate-float">
                        <div class="inline-flex items-center justify-center w-32 h-32 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-2xl shadow-indigo-500/50 mb-6">
                            <i data-lucide="shield-check" class="w-16 h-16 text-white"></i>
                        </div>
                    </div>

                    <!-- Title -->
                    <h1 class="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-fade-in">
                        Cortex Shield
                    </h1>

                    <!-- Subtitle -->
                    <p class="text-2xl md:text-3xl text-gray-300 mb-4 animate-fade-in" style="animation-delay: 0.2s;">
                        AI-Powered Security Analysis Suite
                    </p>

                    <!-- Description -->
                    <p class="text-lg text-gray-400 mb-12 max-w-2xl mx-auto animate-fade-in" style="animation-delay: 0.4s;">
                        Advanced threat detection, fake news verification, code analysis, and comprehensive security tools powered by Google's Gemini 2.0 Flash AI and VirusTotal integration.
                    </p>

                    <!-- Features Grid -->
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 animate-fade-in" style="animation-delay: 0.6s;">
                        <div class="p-6 rounded-xl bg-white/5 backdrop-blur-lg border border-white/10 hover:border-indigo-500/50 transition-all">
                            <div class="w-12 h-12 rounded-lg bg-indigo-500/20 flex items-center justify-center mx-auto mb-4">
                                <i data-lucide="shield" class="w-6 h-6 text-indigo-400"></i>
                            </div>
                            <h3 class="text-white font-semibold mb-2">9 Security Modules</h3>
                            <p class="text-sm text-gray-400">Threat detection, URL scanning, code analysis, and more</p>
                        </div>

                        <div class="p-6 rounded-xl bg-white/5 backdrop-blur-lg border border-white/10 hover:border-purple-500/50 transition-all">
                            <div class="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center mx-auto mb-4">
                                <i data-lucide="zap" class="w-6 h-6 text-purple-400"></i>
                            </div>
                            <h3 class="text-white font-semibold mb-2">Gemini 2.0 Flash</h3>
                            <p class="text-sm text-gray-400">Latest AI technology for accurate analysis</p>
                        </div>

                        <div class="p-6 rounded-xl bg-white/5 backdrop-blur-lg border border-white/10 hover:border-pink-500/50 transition-all">
                            <div class="w-12 h-12 rounded-lg bg-pink-500/20 flex items-center justify-center mx-auto mb-4">
                                <i data-lucide="search" class="w-6 h-6 text-pink-400"></i>
                            </div>
                            <h3 class="text-white font-semibold mb-2">VirusTotal Integration</h3>
                            <p class="text-sm text-gray-400">70+ antivirus engines scanning</p>
                        </div>
                    </div>

                    <!-- Start Button -->
                    <button onclick="landingPage.start()" class="group relative px-12 py-5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xl shadow-2xl shadow-indigo-500/50 transition-all transform hover:scale-105 animate-fade-in" style="animation-delay: 0.8s;">
                        <span class="relative z-10 flex items-center gap-3">
                            <span>Start Analyzing</span>
                            <i data-lucide="arrow-right" class="w-6 h-6 group-hover:translate-x-1 transition-transform"></i>
                        </span>
                    </button>

                    <!-- Version -->
                    <p class="mt-8 text-sm text-gray-500 animate-fade-in" style="animation-delay: 1s;">
                        Version 1.5.0 • Powered by Gemini AI
                    </p>
                </div>
            </div>
        `;

        lucide.createIcons();
    }

    start() {
        console.log('🚀 Starting Cortex Shield application...');
        // Initialize UI Manager and render main app
        window.uiManager = new UIManager();
        uiManager.renderApp();
    }
}

// Initialize landing page
const landingPage = new LandingPage();

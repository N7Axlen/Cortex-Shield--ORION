import { initThreeScene } from './three-scene.js'; // Import the new function

class CortexShieldApp {
    constructor() {
        this.version = CONFIG.APP.VERSION;
        this.initialized = false;
    }

    async init() {
        console.log(`%c🛡️ Cortex Shield v${this.version}`, 'color: #00d9ff; font-size: 20px; font-weight: bold;');
        console.log('%cInitializing security toolkit...', 'color: #00b8d9;');

        try {
            // Initialize 3D background first
            initThreeScene();

            // Show landing page first
            landingPage.render();

            this.setupGlobalListeners();

            if (!CONFIG.FEATURES.DEMO_MODE && hasApiKey) {
                await this.checkAPIHealth();
            }

            this.initialized = true;
            console.log('%c✓ Application initialized successfully!', 'color: #00ffa3; font-weight: bold;');
        } catch (error) {
            console.error('%c✗ Initialization failed:', 'color: #ff3366;', error);
            // Error handling UI can be added here
        }
    }

    setupGlobalListeners() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && uiManager.currentView === 'module') {
                uiManager.renderDashboard();
            }
        });
    }

    async checkAPIHealth() {
        console.log('Checking API health...');
        const result = await cortexAPI.checkHealth();
        if (result.success) {
            console.log('%c✓ API is healthy', 'color: #00ffa3;');
        } else {
            console.warn('%c! API health check failed', 'color: #ffaa00;');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.cortexShield = new CortexShieldApp();
    setTimeout(() => {
        window.cortexShield.init();
    }, 1000);
});
/**
 * Cortex Shield - Module Management
 * Handles module selection, display, and interaction
 */

class ModuleManager {
    constructor() {
        this.currentModule = null;
        this.modules = CONFIG.MODULES;
        this.analysisHistory = [];
    }

    /**
     * Get module by ID
     */
    getModule(moduleId) {
        return this.modules.find(m => m.id === moduleId);
    }

    /**
     * Set current active module
     */
    setCurrentModule(moduleId) {
        this.currentModule = this.getModule(moduleId);
        if (CONFIG.FEATURES.ENABLE_LOCAL_STORAGE) {
            localStorage.setItem(CONFIG.STORAGE.LAST_MODULE, moduleId);
        }
        return this.currentModule;
    }

    /**
     * Get last used module
     */
    getLastModule() {
        if (CONFIG.FEATURES.ENABLE_LOCAL_STORAGE) {
            const lastModuleId = localStorage.getItem(CONFIG.STORAGE.LAST_MODULE);
            return lastModuleId ? parseInt(lastModuleId) : null;
        }
        return null;
    }

    /**
     * Clear current module
     */
    clearCurrentModule() {
        this.currentModule = null;
    }

    /**
     * Get modules by category
     */
    getModulesByCategory(category) {
        return this.modules.filter(m => m.category === category);
    }

    /**
     * Search modules
     */
    searchModules(query) {
        const lowerQuery = query.toLowerCase();
        return this.modules.filter(m => 
            m.name.toLowerCase().includes(lowerQuery) ||
            m.description.toLowerCase().includes(lowerQuery)
        );
    }

    /**
     * Add analysis to history
     */
    addToHistory(moduleId, input, output) {
        const entry = {
            id: Date.now(),
            moduleId,
            moduleName: this.getModule(moduleId)?.name,
            input: input.substring(0, 100) + (input.length > 100 ? '...' : ''),
            output: output.substring(0, 200) + (output.length > 200 ? '...' : ''),
            timestamp: new Date().toISOString()
        };

        this.analysisHistory.unshift(entry);
        
        // Keep only last 50 entries
        if (this.analysisHistory.length > 50) {
            this.analysisHistory = this.analysisHistory.slice(0, 50);
        }

        // Save to localStorage
        if (CONFIG.FEATURES.ENABLE_LOCAL_STORAGE) {
            localStorage.setItem('cortex_shield_history', JSON.stringify(this.analysisHistory));
        }
    }

    /**
     * Get analysis history
     */
    getHistory(limit = 10) {
        return this.analysisHistory.slice(0, limit);
    }

    /**
     * Clear history
     */
    clearHistory() {
        this.analysisHistory = [];
        if (CONFIG.FEATURES.ENABLE_LOCAL_STORAGE) {
            localStorage.removeItem('cortex_shield_history');
        }
    }

    /**
     * Load history from localStorage
     */
    loadHistory() {
        if (CONFIG.FEATURES.ENABLE_LOCAL_STORAGE) {
            const stored = localStorage.getItem('cortex_shield_history');
            if (stored) {
                try {
                    this.analysisHistory = JSON.parse(stored);
                } catch (e) {
                    console.error('Failed to load history:', e);
                    this.analysisHistory = [];
                }
            }
        }
    }

    /**
     * Export history as JSON
     */
    exportHistory() {
        const dataStr = JSON.stringify(this.analysisHistory, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `cortex-shield-history-${Date.now()}.json`;
        link.click();
        URL.revokeObjectURL(url);
    }

    /**
     * Get statistics
     */
    getStatistics() {
        const stats = {
            totalAnalyses: this.analysisHistory.length,
            moduleUsage: {},
            recentActivity: this.analysisHistory.slice(0, 5),
            mostUsedModule: null
        };

        // Calculate module usage
        this.analysisHistory.forEach(entry => {
            stats.moduleUsage[entry.moduleId] = (stats.moduleUsage[entry.moduleId] || 0) + 1;
        });

        // Find most used module
        let maxUsage = 0;
        for (const [moduleId, count] of Object.entries(stats.moduleUsage)) {
            if (count > maxUsage) {
                maxUsage = count;
                stats.mostUsedModule = this.getModule(parseInt(moduleId));
            }
        }

        return stats;
    }
}

// Create global module manager instance
const moduleManager = new ModuleManager();

// Load history on page load
document.addEventListener('DOMContentLoaded', () => {
    moduleManager.loadHistory();
});
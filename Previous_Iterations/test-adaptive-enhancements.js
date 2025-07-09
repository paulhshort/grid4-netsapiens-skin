/* Grid4 Adaptive Enhancement System Test Suite
 * Comprehensive testing for Portal Context Manager and enhancement modules
 * Run this in browser console to validate the adaptive enhancement system
 */

(function() {
    'use strict';

    const AdaptiveEnhancementTester = {
        results: {
            timestamp: new Date().toISOString(),
            portalContextManager: {},
            verticalCenteringFix: {},
            overall: {}
        },

        async runComprehensiveTest() {
            console.log('🧪 Starting Grid4 Adaptive Enhancement System Test Suite...');
            console.log('═'.repeat(80));

            try {
                // Test 1: Portal Context Manager
                await this.testPortalContextManager();
                
                // Test 2: Vertical Centering Fix
                await this.testVerticalCenteringFix();
                
                // Test 3: Integration Tests
                await this.testSystemIntegration();
                
                // Generate final report
                this.generateReport();
                
            } catch (error) {
                console.error('❌ Test suite failed:', error);
            }
        },

        async testPortalContextManager() {
            console.log('🔍 Testing Portal Context Manager...');
            
            const pcm = window.PortalContextManager;
            const results = this.results.portalContextManager;
            
            // Test 1: Manager exists and is initialized
            results.exists = !!pcm;
            results.isReady = pcm?._isReady || false;
            
            if (!pcm) {
                console.error('❌ Portal Context Manager not found');
                results.error = 'Portal Context Manager not loaded';
                return;
            }
            
            // Test 2: Context detection
            results.context = pcm.getContextInfo();
            results.hasValidContext = !!pcm._context;
            
            // Test 3: Layout flags
            results.layoutFlags = pcm._layoutFlags;
            results.hasLayoutFlags = Object.keys(pcm._layoutFlags).length > 0;
            
            // Test 4: Selector functionality
            results.navigationSelector = pcm.getSelector('navigationContainer');
            results.hasNavigationElements = !!document.querySelector(results.navigationSelector || '#navigation');
            
            // Test 5: Probe functionality
            const testProbe = pcm.revalidateProbe('isNavVerticallyCentered');
            results.probeWorking = testProbe !== undefined;
            
            console.log('✅ Portal Context Manager tests completed');
            this.logResults('Portal Context Manager', results);
        },

        async testVerticalCenteringFix() {
            console.log('🎯 Testing Vertical Centering Fix...');
            
            const vcf = window.VerticalCenteringFix;
            const results = this.results.verticalCenteringFix;
            
            // Test 1: Module exists
            results.exists = !!vcf;
            
            if (!vcf) {
                console.error('❌ Vertical Centering Fix not found');
                results.error = 'Vertical Centering Fix not loaded';
                return;
            }
            
            // Test 2: Get current status
            results.status = vcf.getStatus();
            
            // Test 3: Check for applied CSS
            const appliedCSS = document.getElementById('g4-vertical-centering-fix');
            results.hasCSSApplied = !!appliedCSS;
            results.cssMethod = appliedCSS?.getAttribute('data-method') || null;
            
            // Test 4: Navigation elements exist
            results.hasNavigationElements = results.status.navigationElements;
            
            // Test 5: Manual reapply test
            console.log('🔄 Testing manual reapply...');
            vcf.forceReapply();
            
            // Wait a moment and check status again
            setTimeout(() => {
                results.statusAfterReapply = vcf.getStatus();
                console.log('✅ Vertical Centering Fix tests completed');
                this.logResults('Vertical Centering Fix', results);
            }, 500);
        },

        async testSystemIntegration() {
            console.log('🔗 Testing System Integration...');
            
            const results = this.results.overall;
            
            // Test 1: Check Grid4 namespace
            results.hasGrid4Namespace = !!window.g4c;
            results.grid4Features = window.g4c ? Object.keys(window.g4c) : [];
            
            // Test 2: Check event system
            results.hasJQuery = !!window.jQuery;
            
            // Test 3: Check CSS loading
            const grid4CSS = document.querySelector('link[href*="grid4-custom-v3.css"]');
            results.hasGrid4CSS = !!grid4CSS;
            
            // Test 4: Check main JavaScript
            results.hasGrid4JS = !!window.Grid4;
            results.grid4Version = window.Grid4?.version || null;
            
            // Test 5: Performance check
            results.performanceMetrics = {
                resourceCount: performance.getEntriesByType('resource').length,
                elementCount: document.querySelectorAll('*').length,
                hasWrapperMonitoring: !!(window.g4c?.wrapperMonitorInterval)
            };
            
            console.log('✅ System Integration tests completed');
            this.logResults('System Integration', results);
        },

        logResults(testName, results) {
            console.log(`📊 ${testName} Results:`);
            Object.entries(results).forEach(([key, value]) => {
                const status = this.getResultStatus(key, value);
                console.log(`  ${status} ${key}:`, value);
            });
            console.log('');
        },

        getResultStatus(key, value) {
            // Determine if result is good or bad based on key and value
            const goodKeys = ['exists', 'isReady', 'hasValidContext', 'hasLayoutFlags', 'hasNavigationElements', 'probeWorking', 'hasCSSApplied', 'hasGrid4Namespace', 'hasJQuery', 'hasGrid4CSS', 'hasGrid4JS'];
            const badKeys = ['error', 'hasWrapperMonitoring'];
            
            if (badKeys.includes(key) && value) return '❌';
            if (goodKeys.includes(key) && value) return '✅';
            if (goodKeys.includes(key) && !value) return '❌';
            return '📋';
        },

        generateReport() {
            console.log('📈 COMPREHENSIVE TEST REPORT');
            console.log('═'.repeat(80));
            
            const report = {
                timestamp: this.results.timestamp,
                summary: this.calculateSummary(),
                details: this.results,
                recommendations: this.generateRecommendations()
            };
            
            console.log('📊 SUMMARY:');
            console.log(`  Overall Health: ${report.summary.overallHealth}`);
            console.log(`  Portal Context Manager: ${report.summary.pcmStatus}`);
            console.log(`  Vertical Centering Fix: ${report.summary.vcfStatus}`);
            console.log(`  System Integration: ${report.summary.integrationStatus}`);
            console.log('');
            
            if (report.recommendations.length > 0) {
                console.log('💡 RECOMMENDATIONS:');
                report.recommendations.forEach((rec, index) => {
                    console.log(`  ${index + 1}. ${rec}`);
                });
                console.log('');
            }
            
            console.log('🎯 DEBUGGING COMMANDS:');
            console.log('  window.PortalContextManager.getContextInfo() - Get portal context');
            console.log('  window.VerticalCenteringFix.getStatus() - Get centering status');
            console.log('  window.VerticalCenteringFix.forceReapply() - Force reapply fix');
            console.log('  window.g4c - Access Grid4 namespace');
            console.log('');
            
            // Store results globally for access
            window.AdaptiveTestResults = report;
            console.log('💾 Results saved to window.AdaptiveTestResults');
            console.log('═'.repeat(80));
            
            return report;
        },

        calculateSummary() {
            const pcm = this.results.portalContextManager;
            const vcf = this.results.verticalCenteringFix;
            const overall = this.results.overall;
            
            const pcmStatus = pcm.exists && pcm.isReady ? '✅ Working' : '❌ Issues';
            const vcfStatus = vcf.exists && vcf.hasNavigationElements ? '✅ Working' : '❌ Issues';
            const integrationStatus = overall.hasGrid4Namespace && overall.hasJQuery ? '✅ Working' : '❌ Issues';
            
            let overallHealth = '✅ Excellent';
            if (pcmStatus.includes('❌') || vcfStatus.includes('❌') || integrationStatus.includes('❌')) {
                overallHealth = '⚠️ Needs Attention';
            }
            
            return {
                overallHealth,
                pcmStatus,
                vcfStatus,
                integrationStatus
            };
        },

        generateRecommendations() {
            const recommendations = [];
            const pcm = this.results.portalContextManager;
            const vcf = this.results.verticalCenteringFix;
            const overall = this.results.overall;
            
            if (!pcm.exists) {
                recommendations.push('Portal Context Manager not loaded - check CDN URL and network connectivity');
            }
            
            if (!vcf.exists) {
                recommendations.push('Vertical Centering Fix not loaded - ensure Portal Context Manager loads first');
            }
            
            if (pcm.exists && !pcm.isReady) {
                recommendations.push('Portal Context Manager not ready - wait for portalManagerReady event');
            }
            
            if (!vcf.hasCSSApplied && vcf.exists) {
                recommendations.push('Vertical centering CSS not applied - navigation may already be centered');
            }
            
            if (overall.performanceMetrics?.hasWrapperMonitoring) {
                recommendations.push('Wrapper background monitoring detected - performance issue may exist');
            }
            
            if (overall.performanceMetrics?.resourceCount > 100) {
                recommendations.push(`High resource count (${overall.performanceMetrics.resourceCount}) - consider optimization`);
            }
            
            if (!overall.hasGrid4CSS) {
                recommendations.push('Grid4 CSS not detected - main styling may not be loaded');
            }
            
            return recommendations;
        }
    };

    // Auto-run if jQuery is available, otherwise provide manual trigger
    if (window.jQuery) {
        console.log('🚀 Auto-running Grid4 Adaptive Enhancement Test Suite...');
        AdaptiveEnhancementTester.runComprehensiveTest();
    } else {
        console.log('⏳ jQuery not detected - test suite ready');
        console.log('Run AdaptiveEnhancementTester.runComprehensiveTest() manually when ready');
    }
    
    // Expose globally for manual use
    window.AdaptiveEnhancementTester = AdaptiveEnhancementTester;
    
})();
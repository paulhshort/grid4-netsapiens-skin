/* ===================================================================
   GRID4 PORTAL BACKGROUND SELECTOR
   Allows users to customize their portal background
   =================================================================== */

(function($) {
    'use strict';
    
    const BackgroundSelector = {
        // Available backgrounds
        backgrounds: [
            { name: 'Default Dark', url: '', color: '#1a2332' },
            { name: 'Deep Purple', url: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=1920', color: null },
            { name: 'Ocean Blue', url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1920', color: null },
            { name: 'Forest Green', url: 'https://images.unsplash.com/photo-1511884642898-4c92249e20b6?w=1920', color: null },
            { name: 'Sunset Orange', url: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=1920', color: null },
            { name: 'Space Black', url: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1920', color: null },
            { name: 'Abstract Mesh', url: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=1920', color: null },
            { name: 'Gradient Blue', url: '', color: 'linear-gradient(135deg, #1e3c72, #2a5298)' },
            { name: 'Gradient Purple', url: '', color: 'linear-gradient(135deg, #667eea, #764ba2)' },
            { name: 'Solid Gray', url: '', color: '#2a2a2a' }
        ],
        
        init: function() {
            this.createUI();
            this.loadSavedBackground();
            this.bindEvents();
        },
        
        createUI: function() {
            const selectorHTML = `
                <div id="grid4-background-selector" class="grid4-bg-selector">
                    <button id="grid4-bg-toggle" class="grid4-bg-toggle" title="Change Background">
                        <i class="fa fa-paint-brush"></i>
                    </button>
                    <div id="grid4-bg-panel" class="grid4-bg-panel">
                        <h3>Choose Background</h3>
                        <div class="grid4-bg-options">
                            ${this.backgrounds.map((bg, index) => `
                                <div class="grid4-bg-option" data-index="${index}" title="${bg.name}">
                                    <div class="grid4-bg-preview" style="${this.getPreviewStyle(bg)}"></div>
                                    <span>${bg.name}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `;
            
            // Add to sidebar
            $('#navigation').append(selectorHTML);
            
            // Add styles
            this.injectStyles();
        },
        
        getPreviewStyle: function(bg) {
            if (bg.url) {
                return `background-image: url('${bg.url}'); background-size: cover; background-position: center;`;
            } else if (bg.color) {
                return `background: ${bg.color};`;
            }
            return '';
        },
        
        injectStyles: function() {
            const styles = `
                <style id="grid4-bg-selector-styles">
                    .grid4-bg-selector {
                        position: fixed;
                        bottom: 20px;
                        left: 20px;
                        z-index: 1000;
                    }
                    
                    .grid4-bg-toggle {
                        width: 40px;
                        height: 40px;
                        border-radius: 50%;
                        background: var(--accent-primary);
                        border: none;
                        color: white;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
                        transition: all 0.3s ease;
                    }
                    
                    .grid4-bg-toggle:hover {
                        transform: scale(1.1);
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
                    }
                    
                    .grid4-bg-panel {
                        position: absolute;
                        bottom: 60px;
                        left: 0;
                        background: var(--surface-secondary-bg);
                        border: 1px solid var(--border-color);
                        border-radius: 12px;
                        padding: 20px;
                        width: 320px;
                        max-height: 400px;
                        overflow-y: auto;
                        opacity: 0;
                        visibility: hidden;
                        transform: translateY(20px);
                        transition: all 0.3s ease;
                        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
                    }
                    
                    .grid4-bg-panel.show {
                        opacity: 1;
                        visibility: visible;
                        transform: translateY(0);
                    }
                    
                    .grid4-bg-panel h3 {
                        margin: 0 0 16px 0;
                        color: var(--text-primary);
                        font-size: 18px;
                    }
                    
                    .grid4-bg-options {
                        display: grid;
                        grid-template-columns: repeat(2, 1fr);
                        gap: 12px;
                    }
                    
                    .grid4-bg-option {
                        cursor: pointer;
                        text-align: center;
                        transition: all 0.2s ease;
                    }
                    
                    .grid4-bg-option:hover {
                        transform: translateY(-2px);
                    }
                    
                    .grid4-bg-preview {
                        width: 100%;
                        height: 80px;
                        border-radius: 8px;
                        margin-bottom: 8px;
                        border: 2px solid transparent;
                        transition: all 0.2s ease;
                    }
                    
                    .grid4-bg-option.active .grid4-bg-preview {
                        border-color: var(--accent-primary);
                        box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.2);
                    }
                    
                    .grid4-bg-option span {
                        font-size: 12px;
                        color: var(--text-secondary);
                    }
                    
                    /* Background application */
                    body.custom-background {
                        background-attachment: fixed !important;
                        background-size: cover !important;
                        background-position: center center !important;
                    }
                    
                    /* Enhance readability with background */
                    body.custom-background #grid4-app-shell .panel,
                    body.custom-background #grid4-app-shell .modal-content {
                        background: rgba(var(--surface-primary-rgb), 0.95) !important;
                    }
                </style>
            `;
            
            $('head').append(styles);
        },
        
        loadSavedBackground: function() {
            const saved = localStorage.getItem('grid4_background');
            if (saved) {
                const index = parseInt(saved);
                this.applyBackground(index);
                $(`.grid4-bg-option[data-index="${index}"]`).addClass('active');
            }
        },
        
        applyBackground: function(index) {
            const bg = this.backgrounds[index];
            if (bg.url) {
                $('body').css({
                    'background-image': `url('${bg.url}')`,
                    'background-color': '#000'
                }).addClass('custom-background');
            } else if (bg.color) {
                $('body').css({
                    'background-image': bg.color.includes('gradient') ? bg.color : 'none',
                    'background-color': bg.color.includes('gradient') ? 'transparent' : bg.color
                }).addClass('custom-background');
            }
            
            localStorage.setItem('grid4_background', index);
        },
        
        bindEvents: function() {
            // Toggle panel
            $(document).on('click', '#grid4-bg-toggle', function(e) {
                e.stopPropagation();
                $('#grid4-bg-panel').toggleClass('show');
            });
            
            // Select background
            $(document).on('click', '.grid4-bg-option', (e) => {
                const index = $(e.currentTarget).data('index');
                $('.grid4-bg-option').removeClass('active');
                $(e.currentTarget).addClass('active');
                this.applyBackground(index);
                setTimeout(() => {
                    $('#grid4-bg-panel').removeClass('show');
                }, 300);
            });
            
            // Close panel when clicking outside
            $(document).on('click', function(e) {
                if (!$(e.target).closest('.grid4-bg-selector').length) {
                    $('#grid4-bg-panel').removeClass('show');
                }
            });
        }
    };
    
    // Initialize when ready
    $(document).ready(function() {
        // Only initialize if we're in the app shell
        if ($('#grid4-app-shell').length > 0) {
            BackgroundSelector.init();
        }
    });
    
})(jQuery);
/* REMOVE CSS @LAYER ARCHITECTURE - Fix broken v2 styles */

const fs = require('fs').promises;

async function removeLayersFromFile(filePath) {
    console.log(`🔧 Removing @layer from ${filePath}...`);
    
    let content = await fs.readFile(filePath, 'utf8');
    
    // Remove the master layer declaration
    content = content.replace(/@layer\s+[^;]+;/g, '');
    
    // Remove layer wrapper blocks
    // This regex matches @layer blockname { and tracks braces to find the closing }
    content = content.replace(/@layer\s+[^{]+\s*\{/g, '');
    
    // Remove standalone closing braces that were layer closers
    // This is trickier - we need to remove the } that closed @layer blocks
    // For safety, we'll do a simpler approach: just remove @layer lines
    
    // Actually, let's do this more carefully
    const lines = content.split('\n');
    const result = [];
    let layerDepth = 0;
    let inLayerBlock = false;
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trim();
        
        // Skip the master @layer declaration
        if (trimmed.match(/@layer\s+[^;]+;/)) {
            console.log(`  Removing master declaration: ${trimmed}`);
            continue;
        }
        
        // Check if this line starts a @layer block
        if (trimmed.match(/@layer\s+[^{]+\s*\{/)) {
            console.log(`  Removing layer wrapper: ${trimmed}`);
            inLayerBlock = true;
            layerDepth = 1;
            continue;
        }
        
        // If we're in a layer block, track braces
        if (inLayerBlock) {
            const openBraces = (line.match(/\{/g) || []).length;
            const closeBraces = (line.match(/\}/g) || []).length;
            layerDepth += openBraces - closeBraces;
            
            // If this line closes the layer block
            if (layerDepth <= 0 && trimmed === '}') {
                console.log(`  Removing layer closer: ${trimmed}`);
                inLayerBlock = false;
                layerDepth = 0;
                continue;
            }
        }
        
        result.push(line);
    }
    
    const newContent = result.join('\n');
    await fs.writeFile(filePath, newContent);
    console.log(`✅ ${filePath} updated successfully`);
}

async function removeAllLayers() {
    try {
        await removeLayersFromFile('./grid4-skin-v2-experimental.css');
        await removeLayersFromFile('./grid4-skin-v2-hybrid.css');
        console.log('🎉 All @layer declarations removed!');
    } catch (error) {
        console.error('❌ Error:', error);
    }
}

removeAllLayers();
// Script to check which lucide icons are actually used
// This helps identify unused imports

const fs = require('fs');
const path = require('path');

const filesToCheck = [
    'd:/APOTEKK/20230140193-react/src/components/UnggahResep.js',
    'd:/APOTEKK/20230140193-react/src/components/DashboardPage.js',
    'd:/APOTEKK/20230140193-react/src/components/PublicPage.js',
    'd:/APOTEKK/20230140193-react/src/pages/KatalogObatPage.js'
];

filesToCheck.forEach(file => {
    console.log(`\n=== Checking: ${path.basename(file)} ===`);
    const content = fs.readFileSync(file, 'utf8');

    // Extract imports
    const importMatch = content.match(/from 'lucide-react';/);
    if (importMatch) {
        const importSection = content.substring(0, content.indexOf("from 'lucide-react';"));
        const lastImport = importSection.lastIndexOf('import');
        const imports = importSection.substring(lastImport);

        // Get all icon names
        const icons = imports.match(/[A-Z][a-zA-Z0-9]*/g) || [];

        icons.forEach(icon => {
            // Check if used (excluding the import line itself)
            const withoutImport = content.replace(imports, '');
            const usageCount = (withoutImport.match(new RegExp(`<${icon}|${icon} `, 'g')) || []).length;

            if (usageCount === 0) {
                console.log(`  ❌ UNUSED: ${icon}`);
            } else {
                console.log(`  ✓ Used ${usageCount}x: ${icon}`);
            }
        });
    }
});

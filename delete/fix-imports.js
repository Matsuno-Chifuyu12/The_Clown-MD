// fix-imports.js
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

function scanAndFixFiles(dir) {
  const files = readdirSync(dir);
  
  for (const file of files) {
    const fullPath = join(dir, file);
    
    if (statSync(fullPath).isDirectory() && !file.includes('node_modules')) {
      scanAndFixFiles(fullPath);
    } else if (extname(file) === '.js') {
      try {
        let content = readFileSync(fullPath, 'utf8');
        
        // Remplacer les imports nommés de baileys
        if (content.includes("from 'baileys'") || content.includes('from "baileys"')) {
          const oldContent = content;
          
          // Pattern: import { x, y } from 'baileys'
          content = content.replace(
            /import\s*{([^}]+)}\s*from\s*['"]baileys['"]/g,
            'import pkg from \'@whiskeysockets/baileys\';\nconst { $1 } = pkg;'
          );
          
          if (content !== oldContent) {
            writeFileSync(fullPath, content, 'utf8');
            console.log(`✅ Fixed: ${fullPath}`);
          }
        }
      } catch (error) {
        console.log(`❌ Error in ${fullPath}:`, error.message);
      }
    }
  }
}

scanAndFixFiles('.');
console.log('🎯 All baileys imports fixed!');

import fs from 'fs';
import path from 'path';
import { initialDatabase } from '../src/initialData';
import { generateStandaloneHtml } from '../src/utils/exportSingleFile';

const standaloneHtml = generateStandaloneHtml(initialDatabase);

// Write to public/index.html and public/index-standalone.html
const publicDir = path.resolve(process.cwd(), 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

fs.writeFileSync(path.join(publicDir, 'index-standalone.html'), standaloneHtml, 'utf-8');
fs.writeFileSync(path.join(publicDir, 'index.html'), standaloneHtml, 'utf-8');

console.log('Successfully generated public/index.html & public/index-standalone.html. Length:', standaloneHtml.length);

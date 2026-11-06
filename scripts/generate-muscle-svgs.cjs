// The native diagram and these portable SVGs share one editable path source.
// Run: node scripts/generate-muscle-svgs.cjs
const fs = require('node:fs');
const path = require('node:path');
const anatomy = require('../assets/images/Muscles/anatomy/anatomy.json');
const directory = path.join(__dirname, '../assets/images/Muscles/anatomy');
const pair = content => `<g>${content}</g><g transform="translate(200 0) scale(-1 1)">${content}</g>`;
const svg = (title, content) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${anatomy.viewBox}" width="200" height="430" role="img" aria-label="${title}">\n<title>${title}</title>\n${content}\n</svg>\n`;
for (const [view, data] of Object.entries(anatomy.views)) {
  const body = pair(`<path d="${anatomy.outline} Z" fill="#e8ecee"/><path d="${anatomy.outline}" fill="none" stroke="#74828b" stroke-width="1.1"/>`);
  const details = `<g fill="none" stroke="#52636e" stroke-width="0.7" stroke-linecap="round" stroke-linejoin="round" opacity="0.55">${pair(`<path d="${data.details}"/>`)}<path d="${data.centerDetails}"/></g>`;
  let muscles = '';
  for (const [group, paths] of Object.entries(data.groups)) {
    const layer = `<g id="${group}" fill="currentColor" stroke="#52636e" stroke-width="0.8" stroke-linejoin="round">${pair(paths.map(d => `<path d="${d}"/>`).join(''))}</g>`;
    fs.writeFileSync(path.join(directory, `${view}-${group}.svg`), svg(`${view} ${group}`, layer));
    muscles += layer;
  }
  fs.writeFileSync(path.join(directory, `${view}-body.svg`), svg(`${view} body`, body + details));
  fs.writeFileSync(path.join(directory, `${view}-muscle-groups.svg`), svg(`${view} muscle groups`, body + `<g color="#9bb3be">${muscles}</g>` + details));
}

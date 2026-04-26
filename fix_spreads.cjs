const fs = require('fs');

const spreads = fs.readFileSync('spreads.txt', 'utf8').split('\n').filter(Boolean);

const changesByFile = {};

spreads.forEach(line => {
    const firstColon = line.indexOf(':');
    if (firstColon === -1) return;
    const file = line.substring(0, firstColon);
    const secondColon = line.indexOf(':', firstColon + 1);
    if (secondColon === -1) return;
    const lnStr = line.substring(firstColon + 1, secondColon);
    const lineNumber = parseInt(lnStr, 10);
    const code = line.substring(secondColon + 1);
    
    if (!changesByFile[file]) {
        changesByFile[file] = [];
    }
    changesByFile[file].push({ lineNumber, code });
});

for (const [file, changes] of Object.entries(changesByFile)) {
    if (fs.existsSync(file)) {
        const lines = fs.readFileSync(file, 'utf8').split('\n');
        let modified = false;
        changes.forEach(({ lineNumber, code }) => {
            const idx = lineNumber - 1;
            if (lines[idx] !== undefined && lines[idx] !== code) {
                // Restore original line
                lines[idx] = code;
                modified = true;
            }
        });
        if (modified) {
            fs.writeFileSync(file, lines.join('\n'), 'utf8');
            console.log(`Restored ${file}`);
        }
    }
}

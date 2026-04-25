const fs = require('fs');
const path = require('path');

function findFiles(dir, match) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(findFiles(file, match));
    } else { 
      if (file.endsWith(match)) results.push(file);
    }
  });
  return results;
}

const modals = findFiles('./src', 'Modal.tsx');

let changedCount = 0;

modals.forEach(file => {
   let content = fs.readFileSync(file, 'utf8');
   let newContent = content;

   // Reduce excessive padding/margins/gaps
   newContent = newContent.replace(/\bp-10\b/g, 'p-6');
   newContent = newContent.replace(/\bp-8\b/g, 'p-5');
   newContent = newContent.replace(/\bp-6\b/g, 'p-4 sm:p-5'); // Header and outer boxes
   
   // Replace some space-y and gap
   newContent = newContent.replace(/\bgap-10\b/g, 'gap-6');
   newContent = newContent.replace(/\bgap-8\b/g, 'gap-5');
   newContent = newContent.replace(/\bspace-y-8\b/g, 'space-y-5');
   newContent = newContent.replace(/\bspace-y-6\b/g, 'space-y-4');
   
   // Reduce oversized inputs/buttons
   newContent = newContent.replace(/h-\[60px\]/g, 'h-12');
   newContent = newContent.replace(/h-\[50px\]/g, 'h-10');
   newContent = newContent.replace(/h-\[48px\]/g, 'h-10');
   newContent = newContent.replace(/\bh-14\b/g, 'h-12'); 
   newContent = newContent.replace(/\bw-14\b/g, 'w-12'); 
   
   newContent = newContent.replace(/\bpx-10\b/g, 'px-6');
   newContent = newContent.replace(/\bpx-8\b/g, 'px-5');
   newContent = newContent.replace(/\bpy-4\b/g, 'py-2.5');

   if (content !== newContent) {
      fs.writeFileSync(file, newContent, 'utf8');
      changedCount++;
   }
});

console.log('Modified', changedCount, 'modals.');

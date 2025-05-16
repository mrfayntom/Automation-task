
const fs = require('fs');
const path = require('path');


const downloadDir = 'C:\\Users\\Mr. Phantom\\Downloads\\Video';


function cleanTitle(title) {
  title = title.replace(/\[.*?\]/g, '');
  title = title.replace(/[^a-zA-Z0-9\s]/g, '')
  title = title.toLowerCase().trim();
  return title;
}


function getCommonTitle(titles) {
  const count = {};
  for (let title of titles) {
    let words = title.split(' ');
    for (let word of words) {
      if (count[word]) {
        count[word] += 1;
      } else {
        count[word] = 1;
      }
    }
  }

  const commons = [];
  for (let word in count) {
    if (count[word] > 1) {
      commons.push(word);
    }
  }

  return commons.join(' ');
}

// Group similar files
function groupFiles(files) {
  const cleaned = {};
  for (let file of files) {
    let name = path.parse(file).name;
    cleaned[file] = cleanTitle(name);
  }

  const used = new Set();
  const groups = [];

  for (let file1 in cleaned) {
    if (used.has(file1)) continue;

    const title1 = cleaned[file1];
    const words1 = new Set(title1.split(' '));
    const group = [file1];

    for (let file2 in cleaned) {
      if (file2 === file1 || used.has(file2)) continue;

      const title2 = cleaned[file2];
      const words2 = new Set(title2.split(' '));
      const commonWords = [...words1].filter(word => words2.has(word));

      if (commonWords.length >= Math.max(words1.size, words2.size) * 0.5) {
        group.push(file2);
        used.add(file2);
      }
    }

    used.add(file1);
    if (group.length > 0) {
      groups.push(group);
    }
  }

  return groups;
}

function findExistingFolder(commonTitle) {
  const folders = fs.readdirSync(downloadDir);
  for (let folder of folders) {
    const fullPath = path.join(downloadDir, folder);
    if (fs.statSync(fullPath).isDirectory()) {
      const cleaned = cleanTitle(folder);
      if (cleaned.includes(commonTitle) || commonTitle.includes(cleaned)) {
        return fullPath;
      }
    }
  }
  return null;
}


function organizeFiles() {
  console.log("Checking files...");

  const all = fs.readdirSync(downloadDir);
  const files = all.filter(f => fs.statSync(path.join(downloadDir, f)).isFile());

  if (files.length === 0) {
    console.log("No files found.");
    return;
  }

  const groups = groupFiles(files);

  for (let group of groups) {
    const groupTitles = group.map(f => cleanTitle(path.parse(f).name));
    let commonTitle = getCommonTitle(groupTitles);
    if (commonTitle.trim() === '') {
      commonTitle = groupTitles[0];
    }

    let folderPath = findExistingFolder(commonTitle);
    if (!folderPath) {
      folderPath = path.join(downloadDir, commonTitle.replace(/\s+/g, ' ').trim());
      fs.mkdirSync(folderPath, { recursive: true });
    }

    for (let file of group) {
      const src = path.join(downloadDir, file);
      const dst = path.join(folderPath, file);
      if (!fs.existsSync(dst)) {
        try {
          fs.renameSync(src, dst);
        } catch (err) {
          console.log("Error moving:", file, err);
        }
      }
    }

    console.log("Moved", group.length, "files to", path.basename(folderPath));
  }
}

// Main loop
function start() {
  organizeFiles();
  console.log("Waiting 30 minutes...\n");
}

start();
setInterval(start, 30 * 60 * 1000);

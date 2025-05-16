const fs = require('fs');
const path = require('path');
const os = require('os');
const chokidar = require('chokidar');
const notifier = require('node-notifier');

const downloadsFolder = path.join(os.homedir(), 'Downloads');
const logFolder = path.join(os.homedir(), 'Documents', 'Logs');
const logFilePath = path.join(logFolder, 'download_log.json');

const fileTypes = {
  images: ['.jpg', '.jpeg', '.png', '.gif', '.bmp'],
  videos: ['.mp4', '.mkv', '.avi', '.mov'],
  rar: ['.zip', '.rar', '.7z'],
  exe: ['.exe']
};

const destinations = {
  images: path.join(downloadsFolder, 'Images'),
  videos: path.join(downloadsFolder, 'Video'),
  rar: path.join(downloadsFolder, 'Rar'),
  exe: path.join(downloadsFolder, 'Exe')
};

for (const key in destinations) {
  if (!fs.existsSync(destinations[key])) {
    fs.mkdirSync(destinations[key], { recursive: true });
  }
}
if (!fs.existsSync(logFolder)) {
  fs.mkdirSync(logFolder, { recursive: true });
}

function getCurrentDateFolder() {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = monthNames[now.getMonth()];
  const year = now.getFullYear();
  return `${day}-${month}-${year}`;
}

function moveToDateFolder(filePath) {
  const fileName = path.basename(filePath);
  const dateFolderName = getCurrentDateFolder();
  const dateFolder = path.join(destinations.images, dateFolderName);
  if (!fs.existsSync(dateFolder)) fs.mkdirSync(dateFolder);
  const dest = path.join(dateFolder, fileName);
  fs.rename(filePath, dest, () => {});
}

function getFileCategory(ext) {
  ext = ext.toLowerCase();
  for (const category in fileTypes) {
    if (fileTypes[category].includes(ext)) return category;
  }
  return null;
}

function loadLog() {
  if (fs.existsSync(logFilePath)) {
    try {
      return JSON.parse(fs.readFileSync(logFilePath, 'utf8'));
    } catch { return []; }
  }
  return [];
}
function saveLog(data) {
  fs.writeFileSync(logFilePath, JSON.stringify(data, null, 2));
}
function logFile(filePath, sizeKB) {
  const log = loadLog();
  log.push({
    date: new Date().toISOString().slice(0, 19).replace('T', ' '),
    name: path.basename(filePath),
    size: sizeKB + ' KB'
  });
  saveLog(log);
}

function moveToCategory(filePath, categoryPath, isImage = false) {
  const fileName = path.basename(filePath);
  const dest = path.join(categoryPath, fileName);
  fs.rename(filePath, dest, (err) => {
    if (!err) {
      const sizeKB = (fs.statSync(dest).size / 1024).toFixed(2);
      logFile(dest, sizeKB);
      if (isImage) moveToDateFolder(dest);
    }
  });
}

function watcherStart() {
  notifier.notify({
    title: 'Hey I sniff something',
    message: 'Guard Dog is active now, better you are in limit',
    timeout: 3
  });

  chokidar.watch(downloadsFolder, { ignoreInitial: true, depth: 0 })
    .on('add', (filePath) => {
      const ext = path.extname(filePath);
      const category = getFileCategory(ext);
      if (!category) return;
      if (category === 'images') {
        moveToCategory(filePath, destinations.images, true);
      } else if (category === 'videos') {
        moveToCategory(filePath, destinations.videos);
      } else {
        moveToCategory(filePath, destinations[category]);
      }
    });
}

function cleanTitle(title) {
  title = title.replace(/\[.*?\]/g, '');
  title = title.replace(/[^a-zA-Z0-9\s]/g, '');
  return title.toLowerCase().trim();
}

function getCommonTitle(titles) {
  const count = {};
  for (let title of titles) {
    for (let word of title.split(' ')) {
      count[word] = (count[word] || 0) + 1;
    }
  }
  return Object.keys(count).filter(word => count[word] > 1).join(' ');
}

function groupFiles(files) {
  const cleaned = {};
  for (let file of files) {
    cleaned[file] = cleanTitle(path.parse(file).name);
  }

  const used = new Set(), groups = [];

  for (let f1 in cleaned) {
    if (used.has(f1)) continue;
    const words1 = new Set(cleaned[f1].split(' '));
    const group = [f1];

    for (let f2 in cleaned) {
      if (f1 === f2 || used.has(f2)) continue;
      const words2 = new Set(cleaned[f2].split(' '));
      const common = [...words1].filter(w => words2.has(w));
      if (common.length >= Math.max(words1.size, words2.size) * 0.5) {
        group.push(f2);
        used.add(f2);
      }
    }

    used.add(f1);
    if (group.length > 1) groups.push(group);
  }

  return groups;
}

function findExistingFolder(base, name) {
  const folders = fs.readdirSync(base).filter(f => 
    fs.statSync(path.join(base, f)).isDirectory()
  );
  for (let f of folders) {
    const cleaned = cleanTitle(f);
    if (cleaned.includes(name) || name.includes(cleaned)) {
      return path.join(base, f);
    }
  }
  return null;
}

function organizeVideos() {
  const dir = destinations.videos;
  const all = fs.readdirSync(dir).filter(f => fs.statSync(path.join(dir, f)).isFile());
  if (all.length === 0) return;

  const groups = groupFiles(all);
  for (let group of groups) {
    const titles = group.map(f => cleanTitle(path.parse(f).name));
    let common = getCommonTitle(titles) || titles[0];
    let folder = findExistingFolder(dir, common);
    if (!folder) {
      folder = path.join(dir, common.replace(/\s+/g, ' ').trim());
      fs.mkdirSync(folder, { recursive: true });
    }
    for (let file of group) {
      const src = path.join(dir, file);
      const dst = path.join(folder, file);
      if (!fs.existsSync(dst)) {
        try { fs.renameSync(src, dst); } catch {}
      }
    }
  }
}

watcherStart();
setInterval(organizeVideos, 30 * 60 * 1000);

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

function makeFolderIfNotExist(folderPath) {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
}

for (const key in destinations) {
  makeFolderIfNotExist(destinations[key]);
}
makeFolderIfNotExist(logFolder);

function getFileCategory(ext) {
  ext = ext.toLowerCase();
  for (const category in fileTypes) {
    if (fileTypes[category].includes(ext)) {
      return category;
    }
  }
  return null;
}


function loadLog() {
  if (fs.existsSync(logFilePath)) {
    const content = fs.readFileSync(logFilePath, 'utf8');
    try {
      return JSON.parse(content);
    } catch {
      return [];
    }
  } else {
    return [];
  }
}

function saveLog(logData) {
  fs.writeFileSync(logFilePath, JSON.stringify(logData, null, 2));
}


function startWatcher() {

  notifier.notify({
    title: 'Downloads Watcher',
    message: 'Watching your downloads folder now.',
    timeout: 5
  });


  const watcher = chokidar.watch(downloadsFolder, {
    ignoreInitial: true,
    depth: 0
  });

  watcher.on('add', (filePath) => {
    const ext = path.extname(filePath);
    const category = getFileCategory(ext);
    if (!category) {
      return; 
    }

    const fileName = path.basename(filePath);
    const destinationPath = path.join(destinations[category], fileName);

    fs.rename(filePath, destinationPath, (err) => {
      if (err) {
        console.error('Failed to move file:', err);
        return;
      }

      const stats = fs.statSync(destinationPath);
      const sizeKB = (stats.size / 1024).toFixed(2);

      const log = loadLog();
      log.push({
        date: new Date().toISOString().slice(0, 19).replace('T', ' '),
        name: fileName,
        size: sizeKB + ' KB'
      });

      saveLog(log);
      console.log(`Moved: ${fileName}`);
    });
  });

  watcher.on('error', (error) => {
    console.error('Watcher error:', error);
  });
}

startWatcher();

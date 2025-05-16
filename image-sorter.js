const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');

const watchFolder = 'C:\\Users\\Mr. Phantom\\Downloads\\Images';


function getCurrentDateFolder() {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = monthNames[now.getMonth()];
  const year = now.getFullYear();
  return `${day}-${month}-${year}`;
}


function moveFileToDateFolder(filePath) {
  const fileName = path.basename(filePath);
  const dateFolderName = getCurrentDateFolder();
  const targetFolder = path.join(watchFolder, dateFolderName);

  if (!fs.existsSync(targetFolder)) {
    fs.mkdirSync(targetFolder); 
  }

  const destination = path.join(targetFolder, fileName);

  fs.rename(filePath, destination, (err) => {
    if (err) {
      console.log('Error moving file:', err.message);
    } else {
      console.log('Moved:', fileName, '=>', dateFolderName);
    }
  });
}


console.log('Watching folder:', watchFolder);

const watcher = chokidar.watch(watchFolder, {
  ignoreInitial: true,
  depth: 0
});

watcher.on('add', (filePath) => {
  if (fs.lstatSync(filePath).isFile()) {
    moveFileToDateFolder(filePath);
  }
});

watcher.on('error', (err) => {
  console.log('Watcher error:', err);
});

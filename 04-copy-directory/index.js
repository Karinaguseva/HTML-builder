const fs = require('fs');
const path = require('path');
const fsPromises = fs.promises;
const dirFrom = path.join(__dirname, 'files');
const dirTo = path.join(__dirname, 'files-copy');

function copyDir() {
  fs.rm(dirTo, {force: true, recursive: true}, (err) => {
    if (err) {
      throw err;
    }

    fs.mkdir(dirTo, {recursive: true}, (err) => {
      if (err) {
        throw err;
      }
    })

    fsPromises.readdir(dirFrom, {withFileTypes: true}).then(files => {
      files.forEach(file => {
        const dirFromFile = path.join(__dirname, 'files', file.name);
        const dirToFile = path.join(__dirname, 'files-copy', file.name);
        fsPromises.copyFile(dirFromFile, dirToFile);
      });
    });
  });
};
copyDir()
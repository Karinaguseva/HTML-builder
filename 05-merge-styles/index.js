const fs = require('fs');
const path = require('path');
const fsPromises = fs.promises;
const stylesFrom = path.join(__dirname, 'styles');

fsPromises.readdir(stylesFrom, {withFileTypes: true}).then(files => {
  const write = fs.createWriteStream(path.join(__dirname, 'project-dist', 'bundle.css'));
  files.forEach(file => {
    const filePath = path.join(stylesFrom, file.name);
    const name = path.basename(filePath);
    const extension = path.extname(filePath);

    if (extension == '.css') {
      const read = fs.createReadStream(path.join(stylesFrom, name));
      read.on('data', data => {
        write.write(data + '\n');
      });
    }
  });
});


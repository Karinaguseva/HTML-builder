const fs = require('fs');
const path = require('path');
const fsPromises = fs.promises;
const stylesFrom = path.join(__dirname, 'styles');
const assetsFrom = path.join(__dirname, 'assets');

async function clearDir() {
    await fsPromises.rm(path.resolve(__dirname, 'project-dist'), { recursive: true, force: true });
}

async function createDir() {
    await fsPromises.mkdir(path.join(__dirname, 'project-dist', 'assets'), { recursive: true }, (err) => {
        if (err) throw new Error(err);
    })
  }

async function copyAssets() {
    fsPromises.readdir(assetsFrom, { withFileTypes: true }).then(files => {
        files.forEach(file => {
            const fileFrom = path.join(__dirname, 'assets', file.name);
            const fileTo = path.join(__dirname, 'project-dist', 'assets', file.name);
            if (file.isFile()) {
                fsPromises.copyFile(fileFrom, fileTo);
            } 
            else {
                fsPromises.readdir(fileFrom, {withFileTypes: true}).then(direction => {
                    fsPromises.mkdir(path.join(__dirname, 'project-dist', `assets/${file.name}`), { recursive: true })
                    direction.forEach(dirFile => {
                        const from = path.join(fileFrom, dirFile.name);
                        const to = path.join(fileTo, dirFile.name);
                        fsPromises.copyFile(from, to);
                    });
                });
            }
        });
    });
  };

  async function compareStyles() {
    fsPromises.readdir(stylesFrom, {withFileTypes: true}).then(files => {
        const write = fs.createWriteStream(path.join(__dirname, 'project-dist', 'style.css'));
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
}

async function htmlBuilder() {
    const template = path.join(__dirname, 'template.html');
    let templateRead = await fsPromises.readFile(template, 'utf-8');
    const componentsDir = path.join(__dirname, 'components');
    const components = await fsPromises.readdir(componentsDir);
    for (let file of components) {
        const extension = path.extname(file);
        if (extension == '.html') {
            const componentName = path.parse(path.join(componentsDir, file)).name;
            let componentRead = await fsPromises.readFile(path.join(componentsDir, file));
            templateRead = templateRead.replace(`{{${componentName}}}`, componentRead);
        };
    }
    fs.writeFile(path.join(__dirname, 'project-dist', 'index.html'), templateRead, (err) => {
      if (err) { throw err; }
    });
}

async function mainFunction() {
    await clearDir();
    await createDir();
    await copyAssets();
    await compareStyles();
    await htmlBuilder()
    return true;
};
mainFunction()
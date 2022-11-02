const path = require('path');
const fs = require('fs');
const secretFolder = path.join(__dirname, 'secret-folder');

fs.readdir(secretFolder, 
    function(err, items) {
        items.forEach((item) => {
            let info = path.parse(item)
            fs.stat(path.resolve(secretFolder, item), 
                function(err, file) {
                    if (!file.isFile()) {
                        return
                    }
                    let size = (file.size / 1024)
                    console.log(`${info.name} - ${info.ext.replace('.', '')} - ${size}kb`)
                }
            )
        })
    }
)
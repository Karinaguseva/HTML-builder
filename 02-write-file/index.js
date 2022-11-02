const fs = require('fs');
const path = require('path');
const txtFile = path.resolve(__dirname, "text.txt")
const { stdin } = process

// создание файла
fs.open(
    txtFile, 'w', 
    (err) => {
    if(err) throw err;
    console.log('Add your text');
});

//вывод сообщения о вводе текста
stdin.on('data', data => {
    if (data.toString().trim() == 'exit') { //выход через слово exit
        exit()
    }
    fs.appendFile(
        txtFile,
        data.toString(),
        err => {
        if (err) throw err;
        }
    );
    }
)

//функция для выхода
function exit(){
    console.log('Good bye!')
    process.exit()
}

//выход через горячую клавишу Ctrl + C
process.on('SIGINT', exit)

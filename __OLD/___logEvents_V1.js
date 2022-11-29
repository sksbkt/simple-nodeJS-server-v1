const { format } = require('date-fns');
const fsPromises = require('fs').promises;
const fs = require('fs');
const path = require('path');

const todayDate = format(new Date(), 'yyyy.MM.dd');
const nowDate = format(new Date(), 'yyyy.MM.dd\tHH:mm:ss');

const dirPath = path.join(__dirname, 'log');
const filePath = path.join(dirPath, `${todayDate}_log.txt`);

async function logEvents(message) {
    let data;
    if (message != '') {
        data = `\n${nowDate}:\n\t${message}`;
    } else {
        data = `\n${nowDate}`;
    }

    if (fs.existsSync(filePath)) {
        await fsPromises.appendFile(filePath, data)
    } else {
        if (!fs.existsSync(path.join(dirPath)))
            await fsPromises.mkdir(dirPath)
        await fsPromises.writeFile(filePath, data)
    }
    console.log('New log:', data);
}
logEvents('ss');
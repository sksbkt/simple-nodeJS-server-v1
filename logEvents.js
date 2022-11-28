const { format } = require('date-fns');
const fsPromises = require('fs').promises;
const fs = require('fs');
const path = require('path');
const { v4: uuid } = require('uuid');


async function logEvents(message, fileName) {
    const dateTime = `${format(new Date(), 'yyyy.MM.dd\tHH:mm:ss')}`;
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`;
    const dirPath = path.join(__dirname, 'logs');

    try {
        if (!fs.existsSync(dirPath)) {
            await fsPromises.mkdir(dirPath);
        }
        await fsPromises.appendFile(path.join(dirPath, fileName), logItem);
    } catch (error) {
        console.log(error);
    }
}

module.exports = logEvents;
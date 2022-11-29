const { format } = require('date-fns');
const fsPromises = require('fs').promises;
const fs = require('fs');
const path = require('path');
const { v4: uuid } = require('uuid');


async function logEvents(message, fileName) {
    const dateTime = `${format(new Date(), 'yyyy.MM.dd\tHH:mm:ss')}`;
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`;
    //? '..' UP one directory
    const dirPath = path.join(__dirname, '..', 'logs');

    try {
        if (!fs.existsSync(dirPath)) {
            await fsPromises.mkdir(dirPath);
        }
        await fsPromises.appendFile(path.join(dirPath, fileName), logItem);
    } catch (error) {
        console.log(error);
    }
}

const logger = (req, res, next) => {
    logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, 'reqLog.txt');
    console.log(req.method, req.path);
    next();
};
module.exports = { logEvents, logger };
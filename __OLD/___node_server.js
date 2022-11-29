const http = require('http');
const path = require('path');
const fs = require('fs');
const fsPromises = require('fs').promises;

const logEvents = require('./logEvents');
const EventEmitter = require('events');
class Emitter extends EventEmitter { };


const myEmitter = new Emitter();

myEmitter.on('log', (msg, fileName) => logEvents(msg, fileName));

const PORT = process.env.PORT || 3500;

async function serveFile(filePath, contentType, response, statusCode = 200) {
    try {
        console.log(statusCode);
        const rawData = await fsPromises.readFile(
            filePath,
            !contentType.includes('image') ? 'utf-8' : ''
        );
        const data = contentType === 'application/json' ? JSON.parse(rawData) : rawData;
        response.writeHead(
            statusCode
            , { 'Content-Type': contentType });
        response.end(
            contentType === 'application/json' ? JSON.stringify(data) : data
        );
    } catch (err) {
        myEmitter.emit('log', `${err.name}:${err.message}`, 'errLog.txt')
        console.log(err);
        response.statusCode = 500;
        response.end();
    }
}

const server = http.Server((req, res) => {
    console.log(req.url, req.method);
    myEmitter.emit('log', `${req.method}\t${req.url}`, 'reqLog.txt')


    const extension = path.extname(req.url);

    let contentType;

    switch (extension) {
        case '.css':
            contentType = 'text/css';
            break;
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.jpg':
            contentType = 'image/jpeg';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.txt':
            contentType = 'text/plain';
            break;
        default:
            contentType = 'text/html';
    }


    let filePath;
    if (contentType === 'text/html') {
        if (req.url === '/' || req.url.slice(-1) === '/') {
            filePath = path.join(__dirname, 'views', 'index.html');
        } else {
            filePath = path.join(__dirname, 'views', req.url);
        }
    } else {
        filePath = path.join(__dirname, req.url);
    }
    // if (!extension && req.url.slice(-1) !== '/') filePath += '.html';

    const fileExists = fs.existsSync(filePath);


    if (fileExists) {
        serveFile(filePath, contentType, res);
    } else {
        switch (path.parse(filePath).base) {
            case 'old-page.html':
                res.writeHead(301, { 'location': '/new-page.html' });
                res.end();
                break;
            case 'www-page.html':
                // res.writeHead(301, { 'location': '/' });
                res.end();
                break;
            default:
                serveFile(path.join(__dirname, 'views', '404.html'), contentType, res, 404);
        }
    }
    console.log(filePath);

    // let filePath;
    // if (req.url === '/' || req.url === 'index.html') {
    //     res.statusCode = 200;
    //     res.setHeader('Content-Type', 'text/html');
    //     filePath = path.join(__dirname, 'views', 'index.html');
    //     fs.readFile(filePath, 'utf-8', (err, data) => {
    //         res.end(data);
    //         console.log(err);
    //     });
    // }
});

server.listen(PORT, () => console.log(`server running on PORT:${PORT}`));
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const { logger } = require('./middleware/logEvents');
const e = require('express');
const errorHandler = require('./middleware/errorHandler');
const corsOption = require('./config/corsOptions');
const PORT = process.env.PORT || 3500;

//? Custom middleware logger
app.use(logger);

//? CORS cross-origin-resource-sharing
app.use(cors(corsOption));

//? builtin middleWares
//? 'content-type: application/x-www.form-urlencoded
app.use(express.urlencoded({ extended: false }));

//? for json
app.use(express.json());

//? for static files e.g: .css .jpg .txt
app.use('/', express.static(path.join(__dirname, '/public')));


//? routes
app.use('/', require('./routes/root'))
app.use('/register', require('./routes/register'))
app.use('/auth', require('./routes/auth'))
app.use('/employees', require('./routes/api/employees'));


//? 404
app.all('*', (req, res) => {
    //? we send 404 code as notfound like this
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
        return;
    }
    if (req.accepts('json')) {
        res.json({ error: '404 NOT FOUND' });
        return;
    }
    res.type('txt').send('404 NOT FOUND');

});

app.use(errorHandler);

app.listen(PORT, () => console.log(`server running on PORT:${PORT}`));
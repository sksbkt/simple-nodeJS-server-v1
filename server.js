require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const verifyJWT = require('./middleware/verifyJWT');
const cookieParser = require('cookie-parser');
const credentials = require('./middleware/credentials');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');
const PORT = process.env.PORT || 3500;

//? connect to mongoDB
connectDB();

//? Custom middleware logger
app.use(logger);

//? handle credentials check
//? and fetch credentials requirement
app.use(credentials);



//? CORS cross-origin-resource-sharing
app.use(cors(corsOptions));

//? builtin middleWares
//? 'content-type: application/x-www.form-urlencoded
app.use(express.urlencoded({ extended: false }));

//? for json
app.use(express.json());

//? middle for cookies
app.use(cookieParser());

//? for static files e.g: .css .jpg .txt
app.use('/', express.static(path.join(__dirname, '/public')));


//? routes
app.use('/', require('./routes/root'));
app.use('/register', require('./routes/register'));
app.use('/auth', require('./routes/auth'));
app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'));

//? since it work like a waterfall requests to employees route fire have pass verifyJWT
//? AUTH GUARDED goes below this line
app.use(verifyJWT);
app.use('/employees', require('./routes/api/employees'));
app.use('/users', require('./routes/api/users'));


//? 404
app.all('*', (req, res) => {
    //? we send 404 code as notfound like this
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (req.accepts('json')) {
        res.json({ "error": "404 Not Found" });
    } else {
        res.type('txt').send("404 Not Found");
    }
});

app.use(errorHandler);
mongoose.connection.once('open', () => {
    console.log('connected to mongoDB');
    app.listen(PORT, () => console.log(`server running on PORT:${PORT}`));
})
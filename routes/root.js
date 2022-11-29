const express = require('express');
const router = express.Router();
const path = require('path');


//? express also accepts regex as route entry
//? REGEX: ^/$ :: must start with / and must end with it
//? REGEX: |/index(.html)? :: or /index.html with .html being optional 

router.get('^/$|/index(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
});

router.get('/new-page(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'new-page.html'));
});

router.get('/old-page(.html)?', (req, res) => {
    //? by default it sends 302 code but we need 301 to status code to tell search engine that its permanent redirect
    res.redirect(301, '/new-page.html');
});
module.exports = router;
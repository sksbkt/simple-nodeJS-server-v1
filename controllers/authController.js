const usersDB = {
    users: require('../model/users.json'),
    setUsers: function (data) { this.users = data }
}
const fsPromises = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');
require('dotenv').config();

async function handleLogin(req, res) {
    const { user, pwd } = req.body;
    if (!user || !pwd) {
        return res.status(400)
            .json({ message: 'Username and password are both required.' });
    }
    const foundUser = usersDB.users.find(person => person.username === user);

    if (!foundUser) {
        return res.sendStatus(401); //? 401:: Unauthorized 
    }
    //evaluate password
    const match = await bcrypt.compare(pwd, foundUser.password);
    if (match) {
        const roles = Object.values(foundUser.roles);
        //* JWT
        const accessToken = jwt.sign(
            {
                "UserInfo":
                {
                    "username": foundUser.username,
                    "roles": roles
                },
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '30s' }
        );
        const refreshToken = jwt.sign(
            { "username": foundUser.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );
        //? saving refresh token along side current user object
        const otherUsers = usersDB.users.filter(person => person.username !== foundUser.username);
        const currentUser = { ...foundUser, refreshToken };
        usersDB.setUsers([...otherUsers, currentUser]);
        await fsPromises.writeFile(
            path.join(__dirname, '..', 'model', 'users.json'),
            JSON.stringify(usersDB.users)
        );
        //? we send refresh token in a *http only* cookie so it will be stored in the heap/ram
        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            sameSite: 'None',
            // secure: true,
            //? A day
            maxAge: 24 * 60 * 60 * 1000
        });
        res.json({ accessToken });

    } else {
        res.sendStatus(401);
    }
}

module.exports = { handleLogin };
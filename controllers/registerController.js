const usersDB = {
    users: require('../model/users.json'),
    setUsers: function (data) { this.users = data; }
}

const fsPromises = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');

async function handleNewUser(req, res) {
    const { user, pwd } = req.body;
    if (!user || !pwd) {
        return res.status(400)
            .json({ message: 'Username and password are both required.' });
    }
    const duplicate = usersDB.users.find(person => person.username === user);
    if (duplicate) {
        return res.status(409)
            .json({ message: 'User already exists.' });
    }
    try {
        //? encrypting the password using bcrypt
        const hashedPwd = await bcrypt.hash(pwd, 10);
        const newUser = {
            "username": user,
            "roles": { "User": role },
            "password": hashedPwd
        };
        usersDB.setUsers([...usersDB.users, newUser]);
        await fsPromises.writeFile(
            path.join(
                __dirname, '..', 'model', 'users.json'
            ),
            JSON.stringify(usersDB.users),
        );
        console.log(usersDB.users);
        res.status(201).json({ 'message': `user: ${user} has been created` })
    } catch (error) {
        res.status(500).json({ "message": error.message });
    }
}

module.exports = { handleNewUser };
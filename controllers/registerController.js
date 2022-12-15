// const usersDB = {
//     users: require('../model/users.json'),
//     setUsers: function (data) { this.users = data; }
// }

const User = require('../model/User');

// const fsPromises = require('fs').promises;
// const path = require('path');
const bcrypt = require('bcrypt');

async function handleNewUser(req, res) {
    const { user, pwd } = req.body;
    console.log(user, pwd);
    if (!user || !pwd) {
        return res.status(400)
            .json({ message: 'Username and password are both required.' });
    }
    // const duplicate = usersDB.users.find(person => person.username === user);
    const duplicate = await User.findOne({ username: user }).exec();
    if (duplicate) {
        return res.status(409)
            .json({ message: 'User already exists.' });
    }


    try {
        //? encrypting the password using bcrypt
        const hashedPwd = await bcrypt.hash(pwd, 10);

        //? create and store new user using mongo
        const result = await User.create({
            "username": user,
            //? we are not passing the user role because we are adding it as the default role in schema
            // "roles": { "User": 2001 },
            "password": hashedPwd
        });
        //*another method for creating and storing
        // const user = new User();
        // user.username = user;
        // user.password = hashedPwd;
        // const result = await user.save();

        console.log(result);

        // const newUser = {
        //     "username": user,
        //     "roles": { "User": role },
        //     "password": hashedPwd
        // };
        // usersDB.setUsers([...usersDB.users, newUser]);
        // await fsPromises.writeFile(
        //     path.join(
        //         __dirname, '..', 'model', 'users.json'
        //     ),
        //     JSON.stringify(usersDB.users),
        // );
        // console.log(usersDB.users);
        res.status(201).json({ 'message': `user: ${user} has been created` })
    } catch (error) {
        res.status(500).json({ "message": error.message });
    }
}

module.exports = { handleNewUser };
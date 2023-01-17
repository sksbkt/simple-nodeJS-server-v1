// const usersDB = {
//     users: require('../model/users.json'),
//     setUsers: function (data) { this.users = data; }
// }

// const fsPromises = require('fs').promises;
// const path = require('path');
const User = require('../model/User');

async function handleLogout(req, res) {
    //? On client(FRONT_END) also delete the accessToken

    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204); //?No Content status code
    const refreshToken = cookies.jwt;
    //? is refresh token in db
    // const foundUser = usersDB.users.find(person => person.refreshToken === refreshToken);
    const foundUser = await User.findOne({ refreshToken }).exec();

    if (!foundUser) {
        res.clearCookie('jwt', {
            httpOnly: true,
            sameSite: 'None',
            secure: true,
            // maxAge: 24 * 60 * 60 * 1000
        });
        return res.sendStatus(204);
    }
    //? delete the refreshToken in the database
    // const otherUsers = usersDB.users.filter(person => person.refreshToken !== foundUser.refreshToken);
    // const currentUser = { ...foundUser, refreshToken: '' };
    // usersDB.setUsers([...otherUsers, currentUser]);
    // await fsPromises.writeFile(path.join(__dirname, '..', 'model', 'users.json'), JSON.stringify(usersDB.users));
    foundUser.refreshToken = foundUser.refreshToken.filter(rt => rt !== refreshToken);
    const result = await foundUser.save();
    console.log(result);

    res.clearCookie('jwt', {
        httpOnly: true,
        sameSite: 'None',
        secure: true,//? secure: true only servers on https :: WILL BE ADDED IN PRODUCTION
    });
    return res.sendStatus(204);
}

module.exports = { handleLogout };
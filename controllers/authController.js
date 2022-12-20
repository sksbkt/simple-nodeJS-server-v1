const User = require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

async function handleLogin(req, res) {
    const { user, pwd } = req.body;
    if (!user || !pwd) return res.status(400).json({ 'message': 'Username and password are required.' });

    // const foundUser = usersDB.users.find(person => person.username === user);
    const foundUser = await User.findOne({ username: user }).exec();
    console.log('HERE');
    if (!foundUser) {
        return res.sendStatus(401); //? 401:: Unauthorized 
    }
    //evaluate password
    const match = await bcrypt.compare(pwd, foundUser.password);
    if (match) {
        // const roles = Object.values(JfoundUser.roles).filter(Boolean);
        const roles = Object.values(foundUser.roles).filter(Boolean);
        console.log(roles);
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
            { expiresIn: '10m' }
        );
        const refreshToken = jwt.sign(
            { "username": foundUser.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );
        //? saving refresh token along side current user object
        // const otherUsers = usersDB.users.filter(person => person.username !== foundUser.username);
        // const currentUser = { ...foundUser, refreshToken };
        // usersDB.setUsers([...otherUsers, currentUser]);
        // await fsPromises.writeFile(
        //     path.join(__dirname, '..', 'model', 'users.json'),
        //     JSON.stringify(usersDB.users)
        // );
        //? we send refresh token in a *http only* cookie so it will be stored in the heap/ram


        foundUser.refreshToken = refreshToken;
        const result = await foundUser.save();
        console.log(result);

        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            //? IMPORTANT
            secure: true,
            sameSite: 'None',
            maxAge: 24 * 60 * 60 * 1000
        });

        res.json({ accessToken });

    } else {
        res.sendStatus(401);
    }
}

module.exports = { handleLogin };
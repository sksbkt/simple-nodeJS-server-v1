const User = require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

async function handleLogin(req, res) {
    const cookies = req.cookies;
    console.log(`cookie available at login: ${JSON.stringify(cookies)}`);
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
            { expiresIn: process.env.ACCESS_TOKEN_DURATION ?? '10m' }
        );
        const newRefreshToken = jwt.sign(
            { "username": foundUser.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: process.env.REFRESH_TOKEN_DURATION ?? '1d' }
        );


        let newRefreshTokenArray =
            !cookies?.jwt
                ? foundUser.refreshToken
                : foundUser.refreshToken.filter(rt => rt !== cookies.jwt);
        console.log(newRefreshTokenArray);

        if (cookies?.jwt) {

            //? Scenario added here: 
            //?     1) User logs in but never uses RT and does not logout 
            //?     2) RT is stolen
            //?     3) If 1 & 2, reuse detection is needed to clear all RTs when user logs in

            const refreshToken = cookies.jwt;
            const foundToken = await User.findOne({ refreshToken }).exec();

            //? refresh token reuse detected
            if (!foundToken) {
                console.log('refresh token reuse detected at login');
                //? clearing out all refresh tokens
                newRefreshTokenArray = [];
            }



            res.clearCookie('jwt', {
                httpOnly: true,
                sameSite: 'None',
                secure: true,
                // maxAge: 24 * 60 * 60 * 1000
            });
        }
        //? saving refresh token along side current user object
        // const otherUsers = usersDB.users.filter(person => person.username !== foundUser.username);
        // const currentUser = { ...foundUser, refreshToken };
        // usersDB.setUsers([...otherUsers, currentUser]);
        // await fsPromises.writeFile(
        //     path.join(__dirname, '..', 'model', 'users.json'),
        //     JSON.stringify(usersDB.users)
        // );
        //? we send refresh token in a *http only* cookie so it will be stored in the heap/ram


        foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
        const result = await foundUser.save();
        console.log(result);


        // ? create secure Cookie with refresh token
        res.cookie('jwt', newRefreshToken, {
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
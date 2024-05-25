const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const {sendWelcomeEmail} = require('./util/sendEmail');
const User = require('../models/User');

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}
function validatePass(pass) {
    return pass.length >= 8;
}
function validateUsername(username) {
    return username.length >= 1;
}

router.post('/createaccount', async (req, res) => {
    try {
        const {  username, email, password} = req.body;
        const fullname = username;
        const checkUser = await User.findOne({ email });
        if (checkUser) {
            return res.json({status: 'error', message: 'Email already taken'});
        }
        if (!validateUsername(username)) return res.json({status: 'error', message: 'Username must include at least 1 character'});
        if (!validateEmail(email)) return res.json({status: 'error', message: 'Please enter a valid email'});
        if (!validatePass(password)) return res.json({status: 'error', message: 'Password must be at least 8 characters long'});

        const hashedPassword = await bcrypt.hash(password, 10);
        const verifyEmailCode = Math.floor(Math.random() * 900000) + 100000;

        const user = new User({
            email,
            fullname,
            password: hashedPassword,
            settings: {
                verifyEmailCode,
            },
            //organizations: [ {id: 234234, title: 'Walmart', }, {id: 234234, title: 'Pulp', }, {id: 234234, title: 'Pine Tree Corner LLC', }, ],
            organizations: [],
            lastOrganization: null,
        });
        await user.save();

        sendWelcomeEmail(email, username, `https://shiftconnect.digitalcaldwell.com/login/verifyemail/${user._id}/${verifyEmailCode}`);

        const jwt_token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
        res.cookie('auth-token', jwt_token, { httpOnly: true, expires: new Date(Date.now() + /*20 * 365 * */ 24 * 60 * 60 * 1000) }).json({ status: 'success' });

    } catch(err) {
        console.error(err);
    }
});

router.post('/', async (req, res) => {
    try {
        const { username, password } = req.body;
        let user;
        if (username.includes("@")) {
            user = await User.findOne({email: username});
        } else {
            user = await User.findOne({username});
        }
        if (!user) {
            return res.json({
                status: 'error',
                message: 'No user with that username/email!',
            });
        }
        const checkPass = await bcrypt.compare(password, user.password);
        if (!checkPass) {
            return res.json({
                status: 'error',
                message: 'Incorrect password!',
            });
        }
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
        res.cookie('auth-token', token, { httpOnly: true, expires: new Date(Date.now() + 20 * 365 * 24 * 60 * 60 * 1000)});

        return res.json({
            status: 'success',
            message: 'User logged in successfully!',
        });
    } catch(err) {
        console.error(err);
    }
});


router.post('/logout', authToken, async (req, res) => {
    try {
        res.cookie('auth-token', '', { expires: new Date(0) }).json({ status: 'success' });
    } catch(err) {
        console.error(err);
    }
});

router.post('/changepassword', authToken, async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        const { newValue, password } = req.body;

        const checkPass = await bcrypt.compare(password, user.password);
        if (!checkPass) {
            return res.json({
                status: 'error',
                message: 'Incorrect password!',
            });
        }

        if (!validatePass(newValue)) return res.json({status: 'error', message: 'Password must be at least 8 characters long'});

        const hashedPassword = await bcrypt.hash(newValue, 10);

        user.password = hashedPassword;
        await user.save();

        res.json({
            status: 'success',
        });

    } catch(err) {
        console.error('Decryption Error:', err);
    }
});

function authToken(req, res, next) {
    const token = req.cookies['auth-token'];
    if (!token) return res.sendStatus(401);
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.userId = user.userId;
        next();
    });
}

module.exports = router;
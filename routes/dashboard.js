const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const Org = require('../models/Org');
const {sendWelcomeEmail, sendVerifyNewEmail, sendEmail, send2fa} = require('./util/sendEmail');

function generateCode(length = 5) {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters[randomIndex];
    }
    
    return code;
}

router.post('/createorg', authToken, async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        const {orgName, invite} = req.body;

        const invited = invite.map(inv => {
            return {
                email: inv,
                jobTitle: 'Worker',
                availability: {},
                shifts: [],
            }
        });
        const joinCode = generateCode();

        const org = new Org({
            title: orgName,
            invited,
            employees: [],
            admins: [user._id],
            joinCode,
            shfits: [],
        });
        await org.save();

        user.organizations.push({id: org._id, title: org.title});
        user.lastOrganization = org._id;
        await user.save();

        res.json({
            status: 'success',
            orgID: org._id,
        });


    } catch(err) {
        console.error(err);
    }
});

router.post('/selectorg', authToken, async (req, res) => {

    try {
        const user = await User.findOne({_id: req.userId});
        if (!user) {
            return res.json({status: 'error', message: 'Bad authentication! Redirecting...'})
        };
        let organization = {};
        if (req.body.orgID) {
            organization = await Org.findById(req.body.orgID);
            user.lastOrganization = organization._id;
            await user.save();
        } else if (user.lastOrganization) {
            
            organization = await Org.findById(user.lastOrganization)
        }


        // Hide crucial information to not send client
        user.password = '';
        
        res.json({
            status: 'success',
            user,
            organization,
        });
    } catch(err) {
        console.error(err);
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
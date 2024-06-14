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
function generateId() {
    const charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let id = '';
    for (let i = 0; i < 9; i++) {
        const randomIndex = Math.floor(Math.random() * charSet.length);
        id += charSet[randomIndex];
    }
    return id;
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

        // Add current user to org
        const userInOrg = {
            userID: user._id,
            fullname: user.fullname,
            notifications: [],
            jobTitle: 'Creator',
            availability: [{startTime: 700, endTime: 1700, available: true },{startTime: 700, endTime: 1700, available: true },{startTime: 700, endTime: 1700, available: true },{startTime: 700, endTime: 1700, available: true },{startTime: 700, endTime: 1700, available: true },{startTime: 700, endTime: 1700, available: true },{startTime: 700, endTime: 1700, available: true },], // sun mon ...
            shifts: [],
        }

        const userAsAdmin = {
            userID: user._id,
            lastView: 'editor', // editor, view
        }

        const org = new Org({
            title: orgName,
            invited,
            users: [userInOrg],
            admins: [userAsAdmin],
            joinCode,
            schedule: {},
            shfits: [],
        });
        await org.save();

        user.organizations.push({id: org._id, title: org.title});
        user.lastOrganization = org._id;
        await user.save();

        res.json({
            status: 'success',
            orgID: org._id,
            organization: org,
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

router.post('/addshift', authToken, async (req, res) => {
    try {
        const user = await User.findOne({_id: req.userId});
        const { orgID, title, timeStart, timeEnd, location, repeat, notes, color } = req.body;
        const organization = await Org.findById(orgID);
        if (!user || !organization) {
            return res.json({status: 'error', message: 'Bad authentication! Redirecting...'})
        };
        const shift = {
            title: title,
            id: generateId(),
            timeStart: timeStart,
            timeEnd: timeEnd,
            location: location,
            repeat: repeat,
            color: color,
            notes: notes,
		}
        // Add shift to org shifts
        organization.shifts.push(shift);
        await organization.save();

        res.json({
            status: 'success',
            shift,
        });

    } catch(err) {
        console.error(err);
    }
});
router.post('/scheduleshift', authToken, async (req, res) => {
    try {
        const user = await User.findOne({_id: req.userId});
        const { orgID, shiftID, userID, date } = req.body;
        const organization = await Org.findById(orgID);
        if (!user || !organization) {
            return res.json({status: 'error', message: 'Bad authentication! Redirecting...'})
        };
        const shift = organization.shifts.find(shift => shift.id === shiftID);
        // Add shift id to orguser
        let foundUser = false;
        organization.users = organization.users.map(orguser => {
            if (orguser.userID == userID) {
                foundUser = true;
                orguser.shifts.push(shift.id);
                return orguser;
            } else {
                return orguser;
            }
        });
        if (!foundUser) {
            return res.json({
                status: 'error',
                message: 'User not found in organization!',
            });
        }
        // Add to org schedule
        const schID = generateId();
        const data = {
            id: schID,
            userID,
            date,
            shiftID: shift.id
        }
        organization.schedule.push(data);

        await organization.save();
        res.json({
            status: 'success',
            data,
        });
    } catch(err) {
        console.error(err);
    }
});
router.post('/unscheduleshift', authToken, async (req, res) => {
    try {
        const user = await User.findOne({_id: req.userId});
        const { orgID, scheduleID } = req.body;
        const organization = await Org.findById(orgID);
        if (!user || !organization) {
            return res.json({status: 'error', message: 'Bad authentication! Redirecting...'})
        };

        const schedule = organization.schedule.filter(sch => {
            return sch.id !== scheduleID;
        });
        organization.schedule = schedule;

        await organization.save();
        res.json({
            status: 'success',
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
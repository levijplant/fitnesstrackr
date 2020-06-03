const activitiesRouter = require('express').Router();
const { getAllActivities, updateActivity, createActivity } = require('../db');
const { requireUser, requireActiveUser } = require('./utils');
const { usertoken } = require('./users');

activitiesRouter.use((req, res, next) => {
    console.log('A request is being made to /activities');
    next();
});

activitiesRouter.get('/', async (req, res) => {
    const activities = await getAllActivities();
    res.send({
        activities
    });
});



activitiesRouter.post('/activities', async (req, res, next) => {
    const { name, description } = req.body;

    try {
        if (usertoken) {
            const activity = await createActivity();
            
        }
    } catch ({ name, message }) {
        next({ name, message });
    };
});

module.exports = activitiesRouter;
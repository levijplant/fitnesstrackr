const activitiesRouter = require('express').Router();
const { getAllActivities, updateActivity, createActivity } = require('../db');
const { requireUser, requireActiveUser } = require('./utils');

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
        
    } catch (error) {
        
    }
});

module.exports = activitiesRouter;
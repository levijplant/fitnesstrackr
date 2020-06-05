const activitiesRouter = require('express').Router();
const { getAllActivities, updateActivity, createActivity, getActivityById } = require('../db');
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

activitiesRouter.post('/', requireUser, async (req, res, next) => {
    try {
        const { name, description } = req.body;
        const activityData = { name, description }
        const activity = await createActivity(activityData);
        
        if (activity) {
            res.send({ activity });
        } else {
            next({
                name: "CreateActivityError",
                message: "Must be logged in to create activity"
            })
        }
    } catch ({ name, message }) {
        next({ name, message });
    };
});

activitiesRouter.patch('/:activityId', requireUser, async (req, res, next) => {
    const { activityId } = req.params;
    const { name, description } = req.body;
    const updateFields = {};

    if (name) {
        updateFields.name = name;
    }

    if (description) {
        updateFields.description = description;
    }

    try {
        const updatedActivity = await updateActivity(activityId, updateFields);

        res.send({ activity: updatedActivity });
    } catch ({ name, message }) {
        next({ name, message });
    }
});

module.exports = activitiesRouter;
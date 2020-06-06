const routinesActivitiesRouter = require('express').Router();
const { getRoutineActivityById, updateRoutineActivity } = require('../db/routine_activities');
const { requireUser } = require('./utils');

routinesActivitiesRouter.patch('/:routineActivityId', requireUser, async (req, res, next) => {
    const { routineActivityId } = req.params;
    const { count, duration } = req.body;

    const updateFields = {};

    if (count) {
        updateFields.count = count;
    }

    if (duration) {
        updateFields.duration = duration;
    }  

    try {
        const originalRoutineActivity = await getRoutineActivityById(routineActivityId);

        if(originalRoutineActivity.creatorId === req.user.id) {
            const updatedRoutineActivity = await updateRoutineActivity(routineActivityId, updateFields);
            res.send({ routine: updatedRoutineActivity })
        }
    } catch ({ name, message }) {
        next({ name, message });
    };
});

routinesActivitiesRouter.delete('/:routineActivityId', requireUser, async (req, res, next) => {
    const { routineActivityId } = req.params;

    try {
        const routineActivity = await getRoutineActivityById(routineActivityId);

        if (routineActivity.creatorId === req.user.id) {
            await deleteRoutine(routineActivityId);
            console.log('activity has been deleted from routine!');
        }

        res.send('activity has been deleted from routine!')
    } catch ({ name, message }) {
        next({ name, message })
    }
});

module.exports = routinesActivitiesRouter;
const routineActivitiesRouter = require('express').Router();
const { getRoutineActivityById, updateRoutineActivity, deleteActivityFromRoutine } = require('../db');
const { requireUser } = require('./utils');

routineActivitiesRouter.use((req, res, next) => {
    console.log('A request is being made to /routine_activities');
    next();
});


routineActivitiesRouter.patch('/:routineActivityId', requireUser, async (req, res, next) => {
    const { routineActivityId } = req.params;
    const { count, duration } = req.body;

    const updateFields = {};

    if (count) {
        updateFields.count = count;
    };

    if (duration) {
        updateFields.duration = duration;
    };  

    try {
        const originalRoutineActivity = await getRoutineActivityById(routineActivityId);

        if(originalRoutineActivity) {
            const updatedRoutineActivity = await updateRoutineActivity(routineActivityId, updateFields);
            res.send({ routine: updatedRoutineActivity });
        }
    } catch ({ name, message }) {
        next({ name, message });
    };
});

routineActivitiesRouter.delete('/:routineActivityId', requireUser, async (req, res, next) => {
    const { routineActivityId } = req.params;

    try {
        const routineActivity = await getRoutineActivityById(routineActivityId);

        if (routineActivity) {
            await deleteActivityFromRoutine(routineActivityId);
            console.log('Activity has been deleted from routine!');
        };

        res.send('Activity has been deleted from routine!');
    } catch ({ name, message }) {
        next({ name, message })
    };
});

module.exports = routineActivitiesRouter;
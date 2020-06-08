const routineActivitiesRouter = require('express').Router();
const { getRoutineActivityById, updateRoutineActivity, getRoutinesByActivity, deleteActivityFromRoutine } = require('../db');
const { requireUser } = require('./utils');
const client = require('../db/database')

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
        const { rows: [ routine_activity ] } = await client.query(`
            SELECT * 
            FROM routine_activities
            JOIN routines ON routine_activities."routineId" = routines.id
            AND routine_activities.id = $1;
        `, [ routineActivityId ]);

        const originalRoutineActivity = await getRoutineActivityById (routineActivityId);

        if(originalRoutineActivity && req.user.id === routine_activity.creatorId) {
            const updatedRoutineActivity = await updateRoutineActivity(routineActivityId, updateFields);
            res.send({ Updated_Routine: updatedRoutineActivity });
        } else {
            next({ message: "You are not authorized to update a routine you did not create!"})
        };
    } catch ({ name, message }) {
        next({ name, message });
    };
});

routineActivitiesRouter.delete('/:routineActivityId', requireUser, async (req, res, next) => {
    const { routineActivityId } = req.params;
    const { creatorId } = await getRoutinesByActivity(routineActivityId);
    console.log(creatorId);

    try {
        const { rows: [ routine_activity ] } = await client.query(`
        SELECT * 
        FROM routine_activities
        JOIN routines ON routine_activities."routineId" = routines.id
        AND routine_activities.id = $1;
    `, [ routineActivityId ]);

        const routineActivity = await getRoutineActivityById(routineActivityId);

        if (routineActivity && req.user.id === routine_activity.creatorId) {
            await deleteActivityFromRoutine(routineActivityId);
            res.send('Activity has been deleted from routine!');
        } else {
            next({ message: "You are not authorized to delete an activity from a routine you did not create!"});
        };
    } catch ({ name, message }) {
        next({ name, message })
    };
});

module.exports = routineActivitiesRouter;
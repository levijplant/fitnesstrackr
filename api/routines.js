const routinesRouter = require('express').Router();
const { createRoutine, updateRoutine, getAllRoutines, getRoutineById, deleteRoutine } = require('../db/routines');
const { getActivityById } = require('../db/activities');
const { addActivityToRoutine } = require('../db/routine_activities');
const { requireUser, requireActiveUser } = require('./utils');

routinesRouter.use((req, res, next) => {
    console.log('A request is being made to /routines');
    next();
});

routinesRouter.get('/', async (req, res) => {
    const routines = await getAllRoutines();
    res.send({
        routines
    });
});

routinesRouter.post('/', requireUser, async (req, res, next) => {
    try {
        const { public, name, goal } = req.body;
        const routineData = { creatorId: req.user.id, public, name, goal };
        const routine = await createRoutine(routineData);
        
        if (routine) {
            res.send({ routine });
        } else {
            next({
                name: "CreateRoutineError",
                message: "Must be logged in to create routine"
            })
        }
    } catch ({ name, message }) {
        next({ name, message });
    };
});

routinesRouter.patch('/:routineId', requireUser, async (req, res, next) => {
    const { routineId } = req.params;
    const { public, name, goal } = req.body;

    const updateFields = {};

    if (name) {
        updateFields.name = name;
    }

    if (goal) {
        updateFields.goal = goal;
    }  
    
    if (public) {
        updateFields.public = public;
    }

    try {
        const originalRoutine = await getRoutineById(routineId);

        if(originalRoutine.creatorId === req.user.id) {
            const updatedRoutine = await updateRoutine(routineId, updateFields);
            res.send({ routine: updatedRoutine })
        }
    } catch ({ name, message }) {
        next({ name, message });
    };
});

routinesRouter.delete('/:routineId', requireUser, async (req, res, next) => {
    const { routineId } = req.params;

    try {
        const routine = await getRoutineById(routineId);

        if (routine.creatorId === req.user.id) {
            await deleteRoutine(routineId);
            console.log('routine has been deleted!');
        }

        res.send('routine has been deleted!')
    } catch ({ name, message }) {
        next({ name, message })
    }
});

routinesRouter.post('/:routineId/activities', requireUser, async (req, res, next) => {
    const { routineId } = req.params;
    const { activityId, count, duration } = req.body;

    try {
        const routineActivity = await addActivityToRoutine({routineId, activityId, count, duration});
    
        res.send({ routineActivity });
    } catch ({ name, message }) {
        next({ name, message })
    }
});

module.exports = routinesRouter;
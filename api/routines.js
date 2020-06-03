const routinesRouter = require('express').Router();
const { createRoutine, updateRoutine, getAllRoutines } = require('../db/routines');
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

module.exports = routinesRouter;
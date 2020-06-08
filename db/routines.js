const client = require('./database');
const { getUserByUsername, getUserById } = require('./users');
const { getActivitiesByRoutineId } = require('./activities');
const { addActivityToRoutine } =  require('./routine_activities');

async function createRoutine({ creatorId, public, name, goal }) {
    try {
        const { rows: [ routine ] } = await client.query(`
            INSERT INTO routines("creatorId", public, name, goal) 
            VALUES($1, $2, $3, $4) 
            ON CONFLICT (name) DO NOTHING 
            RETURNING *;
        `, [ creatorId, public, name, goal ]);

        return routine;
    } catch (error) {
        throw error;
    };
};

async function updateRoutine(id, fields = {}) {
    const setString = Object.keys(fields).map(
        (key, index) => `"${ key }"=$${ index + 1 }`
    ).join(', ');
    if (setString.length === 0) {
        return;
    };
    try {
        const { rows } = await client.query(`
            UPDATE users
            SET ${ setString }
            WHERE id=${ id }
            RETURNING *;
        `, Object.values(fields));

        return rows;
    } catch (error) {
        throw error;
    };
};

async function getAllRoutines() {
    try {
        const { rows: routines } = await client.query(`
            SELECT *
            FROM routines;
        `);

        for (let routine of routines) {
            routine.activities = await getActivitiesByRoutineId(routine.id);
        };

        return routines;
    } catch (error) {
        throw error;
    };
};

async function getRoutineByName(name) {
    try {
        const { rows: [ routine ] } = await client.query(`
            SELECT *
            FROM routines
            WHERE name=$1
        `, [ name ]);
        
        return routine; 
    } catch (error) {
        throw error;
    };
};

async function getRoutineById(routineId) {
    try {
        const { rows: [ routine ] } = await client.query(`
            SELECT *
            FROM routines
            WHERE id=$1;
        `, [ routineId ]);

        return routine;
    } catch (error) {
        throw error;
    }
};

async function getAllPublicRoutines() {
    try {
        const { rows: routines } = await client.query(`
            SELECT *
            FROM routines
            WHERE public=true;
        `);

        for (let routine of routines) {
            routine.activities = await getActivitiesByRoutineId(routine.id);
        };

        return routines;
    } catch (error) {
        throw error;
    };
};

async function getAllRoutinesByUser(username) {
    try {
        const user = await getUserByUsername(username);
        const id = user.id;
        
        const { rows: routines } = await client.query(`
            SELECT *
            FROM routines
            WHERE "creatorId"=${ id };
        `);

        for (let routine of routines) {
            routine.activities = await getActivitiesByRoutineId(routine.id);
        };
        
        return routines;
    } catch (error) {
        throw error;
    };
};

async function getAllPublicRoutinesByUser(username) {
    try {
        const user = await getUserByUsername(username);
        const id = user.id;
        
        
        const { rows: routines } = await client.query(`
            SELECT *
            FROM routines
            WHERE "creatorId"=${ id }
            AND public=true;
        `);

        for (let routine of routines) {
            routine.activities = await getActivitiesByRoutineId(routine.id);
        };

        return routines;
    } catch (error) {
        throw error;
    };
};

async function getPublicRoutinesByActivity(activityId) {
    try {
        const { rows: routines } = await client.query(`
            SELECT routines.*
            FROM routines
            JOIN routine_activities ON routine_activities."routineId"=routines.id
            WHERE routine_activities."activityId"=$1
            AND public=true;
        `, [ activityId ]);

        for (let routine of routines) {
            routine.activities = await getActivitiesByRoutineId(routine.id);
        };

        return routines;
    } catch (error) {
        throw error
    };
};

async function getRoutinesByActivity(activityId) {
    try {
        const { rows: routines } = await client.query(`
            SELECT routines.*
            FROM routines
            JOIN routine_activities ON routine_activities."routineId"=routines.id
            WHERE routine_activities."activityId"=$1;
        `, [ activityId ]);

        for (let routine of routines) {
            routine.activities = await getActivitiesByRoutineId(routine.id);
        };
        console.log("getRoutinesByActivity Routines: ", routines)

        return routines;
    } catch (error) {
        throw error
    };
};

async function deleteRoutine(id) {
    try {
        await client.query(`
            DELETE FROM routines
            WHERE id=$1;
        `, [ id ]);

        await client.query(`
            DELETE FROM routine_activities
            WHERE "routineId"=$1;
        `, [ id ]);
    } catch(error) {
        throw error;
    };
};

module.exports = {
    createRoutine,
    updateRoutine,
    getAllRoutines,
    getRoutineByName,
    getRoutineById,
    getAllPublicRoutines,
    getAllRoutinesByUser,
    getAllPublicRoutinesByUser,
    getPublicRoutinesByActivity,
    getRoutinesByActivity,
    deleteRoutine,
};
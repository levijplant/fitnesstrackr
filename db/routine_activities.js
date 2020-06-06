const client = require('./database');

async function getRoutineActivityById(routineActivityId) {
    try {
        const { rows: [ routineActivity ] } = await client.query(`
            SELECT *
            FROM routine_activities
            WHERE id=$1;
        `, [ routineActivityId ]);

        return routineActivity;
    } catch (error) {
        throw error;
    }
};

async function updateRoutineActivity(id, fields = {}) {
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

async function addActivityToRoutine({ routineId, activityId, count, duration}) {
    console.log('Adding activity to routine is being called!')
    try {
        const { rows: [ routine_activity ] } = await client.query(`
            INSERT INTO routine_activities("routineId", "activityId", count, duration)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `, [ routineId, activityId, count, duration] )


        return routine_activity;
    } catch (error) {
        throw error;
    }
};

async function deleteActivityFromRoutine(id) {
    await client.query(`
        DELETE FROM routine_activities
        WHERE "routineId"=$1;
    `, [ id ])
}

module.exports = {
    addActivityToRoutine,
    getRoutineActivityById,
    updateRoutineActivity,
    deleteActivityFromRoutine
}
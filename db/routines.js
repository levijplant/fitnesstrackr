const client = require('./database');
async function createRoutine({ name, goal }) {
    try {
        const { rows } = await client.query(`
            INSERT INTO routines(name, goal) 
            VALUES($1, $2) 
            ON CONFLICT (name) DO NOTHING 
            RETURNING *;
        `, [ name, goal ]);
        return rows;
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
        const { rows } = await client.query(`
            SELECT *
            FROM routines;
        `);
        return rows;
    } catch (error) {
        throw error;
    };
};
async function getRoutineByName(name) {
    try {
        const { rows } = await client.query(`
            SELECT *
            FROM routines
            WHERE name=$1
        `, [ name ]);
        return rows; 
    } catch (error) {
        throw error;
    };
};
module.exports = {
    createRoutine,
    updateRoutine,
    getAllRoutines,
    getRoutineByName
}
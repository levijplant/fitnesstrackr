const client = require('./database');

async function createActivity({ name, description }) {
    try {
        const { rows } = await client.query(`
            INSERT INTO activities(name, description) 
            VALUES($1, $2) 
            ON CONFLICT(name) DO NOTHING
            RETURNING *;
        `, [ name, description ]);

        return rows;
    } catch (error) {
        throw error;
    };
};

async function updateActivity(id, fields = {}) {
    const setString = Object.keys(fields).map(
        (key, index) => `"${key}"=$${ index + 1 }`
    ).join(', ');

    if (setString.length === 0) {
        return;
    };

    try {
        const { rows } = await client.query(`
            UPDATE activities
            SET ${ setString }
            WHERE id=${ id }
            RETURNING *;
        `, Object.values(fields));

        return rows;
    } catch (error) {
        throw error;
    };
};

async function getAllActivities() {
    try {
        const { rows } = await client.query(`
            SELECT *
            FROM activities
        `);

        if (!rows) {
            return null
        };

        return rows;
    } catch (error) {
        throw error;
    };
};

async function getActivityByName(name) {
    try {
        const { rows } = await client.query(`
            SELECT *
            FROM activities
            WHERE name=$1
        `, [ name ]);

        return rows; 
    } catch (error) {
        throw error;
    };
};

module.exports = {
    createActivity,
    updateActivity,
    getAllActivities,
    getActivityByName,
};
const { Client } = require('pg');
const client = new Client('postgres://localhost:5432/fitness-dev');

async function createUser({ username, password, name, location, active }) {
    try {
        const { rows } = await client.query(`
            INSERT INTO users(username, password, name, location, active) 
            VALUES($1, $2, $3, $4, $5) 
            ON CONFLICT (username) DO NOTHING 
            RETURNING *;
        `, [ username, password, name, location, active ]);

        return rows;
    } catch (error) {
        throw error;
    };
};


module.exports = {
    client,
    createUser
};
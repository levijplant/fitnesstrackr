const client = require('./database');

async function createUser({ username, password, name, location }) {
    try {
        console.log(password);
        const { rows: [ user ] } = await client.query(`
            INSERT INTO users(username, password, name, location) 
            VALUES($1, $2, $3, $4) 
            ON CONFLICT (username) DO NOTHING 
            RETURNING *;
        `, [ username, password, name, location ]);

        return user;
    } catch (error) {
        throw error;
    };
};

async function updateUser(id, fields = {}) {
    const setString = Object.keys(fields).map(
        (key, index) => `"${ key }"=$${ index + 1 }`
    ).join(', ');

    if (setString.length === 0) {
        return;
    };

    try {
        const { rows: [ user ] } = await client.query(`
            UPDATE users
            SET ${ setString }
            WHERE id=${ id }
            RETURNING *;
        `, Object.values(fields));

        return user;
    } catch (error) {
        throw error;
    };
};

async function getUserById(userId) {
    try {
        const { rows: [ user ] } = await client.query(`
            SELECT id, username, name, location, active
            FROM users
            WHERE id=${ userId }
        `);

        if (!user) {
            return null
        };

        return user;
    } catch (error) {
    throw error;
    };
};

async function getAllUsers() {
    try {
        const { rows } = await client.query(`
            SELECT id, username, password, name, location, active
            FROM users;
        `);

        return rows;
    } catch (error) {
        throw error;
    };
};

async function getUserByUsername(username) {
    try {
        const { rows: [ user ] } = await client.query(`
            SELECT *
            FROM users
            WHERE username=$1
        `, [ username ]);
        return user; 
    } catch (error) {
        throw error;
    };
};

module.exports = {
    createUser,
    getAllUsers,
    updateUser,
    getUserById,
    getUserByUsername
};
const {
    client,
    createUser
} = require('./index.js');

async function dropTables() {
    try {
        console.log("Starting to drop tables...");

        await client.query(`
            DROP TABLE IF EXISTS users;
        `);

        console.log("Finished dropping tables.")
    } catch (error) {
        console.log("Error dropping tables!");
        throw error;
    };
};

async function createTables() {
try {
    console.log("Starting to create tables...");

    await client.query(`
        CREATE TABLE users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            name VARCHAR(255) NOT NULL,
            location varchar(255) NOT NULL,
            active boolean DEFAULT true
        );
    `);

    console.log("Finished creating tables!")
} catch (error) {
    console.log("Error creating tables!");
    throw error;
};
};

async function createInitialUsers() {
    try {
        console.log("Starting to create users...");

        await createUser({ 
            username: 'muscleshuge', 
            password: 'iluvpreworkout',
            name: 'Chad Freeman',
            location: 'Los Angeles, California' 
        });
        await createUser({ 
            username: 'fitandfun', 
            password: 'pushupsarelife',
            name: 'Tom Collins',
            location: 'Nunya, Business'
        });
        await createUser({ 
            username: 'fitgirl',
            password: 'arnold',
            name: 'Tamara Thompson',
            location: 'Jacksonville, Florida'
        });

        console.log("Finished creating users!");
    } catch (error) {
        console.error("Error creating users!");
        throw error;
    }
};

async function rebuildDB() {
    try {
        client.connect();
        await dropTables();
        await createTables();
        await createInitialUsers();
        client.end();
    } catch (error) {
        console.log("Error during rebuildDB")
        throw error;
    };
};


rebuildDB();
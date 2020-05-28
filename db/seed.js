const {
    client,
    createUser,
    getAllUsers,
    updateUser,
    getUserById,
} = require('./index');

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
            active BOOLEAN DEFAULT true
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
    } catch (error) {
        console.log("Error during rebuildDB")
        throw error;
    };
};

async function testDB() {
    try {
        console.log("Calling getAllUsers...");
        const users = await getAllUsers();
        console.log("All Users: ", users)

        console.log("Calling updateUser on users[1]");
        const updateUserResult = await updateUser(users[1].id, {
            username: 'groovyash',
            name: "Ashley Williams",
            location: "Elk Grove, Michigan"
        });
        console.log("Updated User:", updateUserResult);


        console.log("Calling getUserById with 1");
        const chad = await getUserById(1);
        console.log("User One:", chad);


    } catch (error) {
        console.log("Error testing the database!");
        throw error;
    };
};

rebuildDB()
    .then(testDB)
    .catch(console.error)
    .finally(() => client.end());
const client = require('./database');
const {
    createUser,
    getAllUsers,
    updateUser,
    getUserById,
    createActivity,
    updateActivity,
    getAllActivities,
    getActivityByName,
} = require('./index');

const bcrypt = require('bcrypt');
const SALT_COUNT = 10;

async function dropTables() {
    try {
        console.log("Starting to drop tables...");

        await client.query(`
            DROP TABLE IF EXISTS routines;
            DROP TABLE IF EXISTS activities;
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
            location VARCHAR(255) NOT NULL,
            active BOOLEAN DEFAULT true
        );
        CREATE TABLE activities(
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) UNIQUE NOT NULL,
            description TEXT NOT NULL
        );
        CREATE TABLE routines(
            id SERIAL PRIMARY KEY,
            "creatorId" INTEGER REFERENCES users(id),
            public BOOLEAN DEFAULT false,
            name VARCHAR(255) UNIQUE NOT NULL,
            goal TEXT not null
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

        const seededUsers = [
            {
                username: 'muscleshuge',
                password: 'iluvpreworkout',
                name: 'Chad Freeman',
                location: 'Los Angeles, California'
            },

            {
                username: 'fitgirl',
                password: 'arnold',
                name: 'Tamara Thompson',
                location: 'Jacksonville, Florida'
            },

            {
                username: 'fitandfun',
                password: 'pushupsarelife',
                name: 'Tom Collins',
                location: 'Nunya, Business'
            }
        ];

        console.log(seededUsers);

        await Promise.all(seededUsers.map(async user => {
            const hashedPassword = bcrypt.hashSync(user.username, SALT_COUNT);
            const seededUser = await createUser({
                ...user,
                password: hashedPassword
            });
            return seededUser;
        }));

        console.log("Finished creating users!");
    } catch (error) {
        console.error("Error creating users!");
        throw error;
    };
};

async function createInitialActivities() {
    try {
        console.log("Starting to create activities...");

        const seededActivities = [

            {
                name: 'Mountain Biking',
                description: 'Riding a mountain bike on some sick trails.'
            },

            {
                name: '12 Ounce Curls',
                description: 'Because who needs to lift anything heavier?'
            },

            {
                name: 'Jumping Jacks',
                description: 'I am too fat for this crap.'
            }

        ];

        await Promise.all(seededActivities.map(async activity => {
            const seededActivity = await createActivity(activity);
            return seededActivity;
        }));
    } catch (error) {
        console.error("Error creating activities!");
        throw error;
    };
};

async function rebuildDB() {
    try {
        console.log(client);
        client.connect();
        await dropTables();
        await createTables();
        await createInitialUsers();
        createInitialActivities();
    } catch (error) {
        console.log("Error during rebuildDB")
        throw error;
    };
};

async function testDB() {
    try {
        console.log("Beginning to test the database...")

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

        console.log("Calling getAllActivies...");
        const activities = await getAllActivities();
        console.log("All Activities: ", activities);

        console.log("Calling updateActivity on activity[2]");
        const updatedActivity = await updateActivity(activities[2].id, {
            name: 'Jumping Jacks',
            description: `These aren't so bad anymore!`
        });
        console.log("Updated Activity: ", updatedActivity);

        console.log("Getting activity Mountain Biking!");
        const mountainBiking = await getActivityByName("Mountain Biking");
        console.log("Mountain Biking: ", mountainBiking);

        console.log("Finished testing the database!")
    } catch (error) {
        console.log("Error testing the database!");
        throw error;
    };
};

rebuildDB()
    .then(testDB)
    .catch(console.error)
    .finally(() => client.end())
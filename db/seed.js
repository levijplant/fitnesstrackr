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
    createRoutine,
    getAllRoutines,
    getAllPublicRoutines,
    getAllRoutinesByUser,
    getAllPublicRoutinesByUser,
    addActivityToRoutine,
} = require('./index');

const bcrypt = require('bcrypt');
const SALT_COUNT = 10;

async function dropTables() {
    try {
        console.log("Starting to drop tables...");

        await client.query(`
            DROP TABLE IF EXISTS routine_activities;
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
        CREATE TABLE activities (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) UNIQUE NOT NULL,
            description TEXT NOT NULL
        );
        CREATE TABLE routines (
            id SERIAL PRIMARY KEY,
            "creatorId" INTEGER REFERENCES users(id),
            public BOOLEAN DEFAULT false,
            name VARCHAR(255) UNIQUE NOT NULL,
            goal TEXT not null
        );
        CREATE TABLE routine_activities (
            id SERIAL PRIMARY KEY,
            "routineId" INTEGER REFERENCES routines(id),
            "activityId" INTEGER REFERENCES activities(id),
            duration INTEGER,
            count INTEGER,
            UNIQUE ("routineId", "activityId")
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
            },

            {
                name: 'Wide Push-Ups',
                description: 'Push-Ups with your arms as wide as possible.'
            },

            {
                name: 'Military Style Push-Ups',
                description: 'Keep arms close to body throughout the range of motion.'
            },

            {
                name: 'Dumbbell Curls',
                description: 'Curl them dumbbells!'
            },

            {
                name: 'Barbell Curls',
                description: 'Curl them Barbells!'
            }

        ];

        await Promise.all(seededActivities.map(async activity => {
            const seededActivity = await createActivity(activity);
            return seededActivity;
        }));

        console.log("Finished creating activities...");
    } catch (error) {
        console.error("Error creating activities!");
        throw error;
    };
};

async function createInitialRoutines() {
    try {
        console.log("Starting to create routines...");

        const seededRoutines = [

            {
                creatorId: 1,
                public: true,
                name: 'Chest Blast!',
                goal: '1000 push ups in a row!!!!!',
            },

            {
                creatorId: 2,
                public: false,
                name: 'The Glute Lifter',
                goal: 'Buns of steel!!!',
            },

            {
                creatorId: 3,
                public: true,
                name: 'Best Workout Ever',
                goal: 'To never leave the couch!!',
            },
            
            {
                creatorId: 1,
                public: true,
                name: 'Arm Assault',
                goal: 'Biceps for days.',
            }

        ];

        await Promise.all(seededRoutines.map(async routine => {
            const seededRoutine = await createRoutine(routine);
            return seededRoutine
        }));

        console.log("Finished creating routines...");
    } catch (error) {
        console.error("Error creating routines!");
        throw error;
    };
};

async function createIntitialRoutineActivities() {
    try {
        console.log("Starting to seed routine_activities...");

        const seededRoutineActivities = [
            {
                routineId: 1,
                activityId: 4,
                count: 25,
                duration: 60
            },
            {
                routineId: 1,
                activityId: 5,
                count: 25,
                duration: 60
            },
            {
                routineId: 4,
                activityId: 6,
                count: 10,
                duration: 60
            },
            {
                routineId: 4,
                activityId: 7,
                count: 10,
                duration: 60
            }
        ];

        await Promise.all(seededRoutineActivities.map(async routineActivity => {
            const seededRoutineActivity = await addActivityToRoutine(routineActivity);
            return seededRoutineActivity;
        }));

        console.log("Finished creating routine_activities...");
    } catch (error) {
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
        await createInitialActivities();
        await createInitialRoutines();
        await createIntitialRoutineActivities()
    } catch (error) {
        console.log("Error during rebuildDB")
        throw error;
    };
};

async function testDB() {
    try {
        console.log("Beginning to test the database...")

        console.log("Calling getAllUsers.");
        const users = await getAllUsers();
        console.log("All Users: ", users)

        console.log("Calling updateUser on users[1].");
        const updateUserResult = await updateUser(users[1].id, {
            username: 'groovyash',
            name: "Ashley Williams",
            location: "Elk Grove, Michigan"
        });
        console.log("Updated User:", updateUserResult);

        console.log("Calling getUserById with 1.");
        const chad = await getUserById(1);
        console.log("User One:", chad);

        console.log("Calling getAllActivies.");
        const activities = await getAllActivities();
        console.log("All Activities: ", activities);

        console.log("Calling updateActivity on activity[2].");
        const updatedActivity = await updateActivity(activities[2].id, {
            name: 'Jumping Jacks',
            description: `These aren't so bad anymore!`
        });
        console.log("Updated Activity: ", updatedActivity);

        console.log("Getting activity Mountain Biking!");
        const mountainBiking = await getActivityByName("Mountain Biking");
        console.log("Mountain Biking: ", mountainBiking);

        console.log("Calling getAllRoutines.");
        const routines = await getAllRoutines();
        console.log("All Routines: ", routines);

        console.log("Call getAllPublicRoutines.");
        const publicRoutines = await getAllPublicRoutines();
        console.log("Public Routines: ", publicRoutines);

        console.log("Calling getAllRoutinesByUser with user muscleshuge.");
        const muscleshugeRoutines = await getAllRoutinesByUser("muscleshuge");
        console.log("muscleshuge Routines: ", muscleshugeRoutines);

        console.log("Calling getAllPublicRoutinesByUser with user muscleshuge");
        const muscleshugePublicRoutines = await getAllPublicRoutinesByUser("muscleshuge");
        console.log("muscleshuge Public Routines: ", muscleshugePublicRoutines);

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
const usersRouter = require('express').Router();
const { getAllUsers, getUserByUsername, createUser } = require('../db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

usersRouter.use((req, res, next) => {
    console.log('A request is being made to /users');
    
    next();
});

usersRouter.get('/', async (req, res) => {
    const users = await getAllUsers();
    res.send({
    users
});
});

usersRouter.post('/register', async (req, res, next) => {
    const { username, password, name, location } = req.body;
    const SALT_COUNT = 10;

    try {
      const _user = await getUserByUsername(username);
  
      if (_user) {
        next({
          name: 'UserExistsError',
          message: 'A user by that username already exists'
        });
      }

      bcrypt.hash(password, SALT_COUNT, async function(hashedPassword) {
        const user = await createUser({
            username,
            password: hashedPassword,
            name,
            location,
        });

        const token = jwt.sign({ 
            id: user.id, 
            username
        }, process.env.JWT_SECRET, {
            expiresIn: '1w'
        });

        res.send({ 
            message: "thank you for signing up",
            token 
        });
      });
    } catch ({ name, message }) {
      next({ name, message })
    } 
  });

module.exports = usersRouter;
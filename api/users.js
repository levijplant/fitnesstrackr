const usersRouter = require('express').Router();
const { getAllUsers, getUserByUsername, createUser } = require('../db');
const { requireUser, requireActiveUser } = require('./utils');
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

    bcrypt.hash(password, SALT_COUNT, async function (err, hashedPassword) {
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

usersRouter.post('/login', async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    next({
      name: "MissingCredentialsError",
      message: "Please supply both a username and password"
    });
  };

  try {
    const user = await getUserByUsername(username);
    const hashedPassword = user.password;

    console.log(hashedPassword)
    console.log(password)


    bcrypt.compare(password, hashedPassword, function (err, passwordsMatch) {
      if (passwordsMatch) {
        const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET)
        res.send({ message: "you're logged in!", token: `${token}` });

        return token;
      } else {
        next({
          name: 'IncorrectCredentialsError',
          message: 'Username or password is incorrect'
        });
      };
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

usersRouter.delete('/:userId', requireActiveUser, async (req, res, next) => {
  const { userId } = req.params;
  const user = req.user;
  try {
    if (user && user.id === Number(userId)) {
      const deactivatedUser = await updateUser(user.id, {
        active: false
      });
      res.send({ deactivatedUser });
      console.log("Deactivated User: ", deactivatedUser);
    } else {
      next({
        name: "DeleteUserError",
        message: "You cannot delete a username that is not yours"
      })
    };
  } catch ({ name, message }) {
    next({ name, message });
  };
});

usersRouter.patch('/:userId', requireUser, async (req, res, next) => {
  const { userId } = req.params;
  const user = req.user;
  console.log("UserId: ", userId)
  console.log('Req.user: ', req.user)
  console.log("Req.user.id: ", req.user.id)
  try {
    if (user && user.id === Number(userId)) {
      const activatedUser = await updateUser(user.id, {
        active: true
      });
      res.send({ activatedUser });
      console.log("Activated User: ", activatedUser);
    } else {
      next({
        name: "ActivateUserError",
        message: "You cannot activate a username that is not yours"
      })
    };
  } catch ({ name, message }) {
    next({ name, message });
  };
});

module.exports = usersRouter
const express = require('express');
const router = require("express").Router();

const bcrypt = require("bcrypt");
const saltRounds = 10;

const User = require("../models/User.model")

/* Signup page *////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*Get */
router.get("/signup", (req, res) => {
    res.render("auth/signup");
});

/*Post */
router.post("/signup", async (req, res) => {
    const { username, password } = req.body;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    User.create({ username, passwordHash})
    .then((newUser)=> res.redirect(`/profile/${newUser.username}`))
    .catch(err => console.log(err))
 
});

/*Get - Profile */
router.get("/profile/:username", (req, res) => {
    const {username} = req.params;
    User.findOne({username})
    .then(foundUser => res.render("auth/profile", {user: foundUser}))
    
});

/* Login page */////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*Get */
router.get('/login', (req, res) => 
res.render('auth/login'));

/*Post */
router.post('/login', (req, res) => {
    const { username, password } = req.body;
   
    if (username === '' || password === '') {
      res.render('auth/login', {
        errorMessage: 'Please enter both, username and password to login.'
      });
      return;
    }
   
    User.findOne({ username })
      .then(user => {
        if (!user) {
          res.render('auth/login', { errorMessage: 'Username is not registered. Try with other username.' });
          return;
        } else if (bcrypt.compareSync(password, user.passwordHash)) {
          res.redirect(`/profile/${user.username}`);
        } else {
          res.render('auth/login', { errorMessage: 'Incorrect password.' });
        }
      })
      .catch(err => next(err));
  });

module.exports = router;
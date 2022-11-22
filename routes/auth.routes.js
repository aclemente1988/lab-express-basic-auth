const express = require('express');
const router = require("express").Router();

const bcrypt = require("bcrypt");
const saltRounds = 10;

const User = require("../models/User.model")

/* Signup page *////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*Get */
router.get("/signup", (req, res) => {
    console.log(req.session)
    res.render("auth/signup");
});

/*Post */
router.post("/signup", async (req, res) => {
    const { username, password } = req.body;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    User.create({ username, passwordHash})
    .then((newUser)=> {
        req.session.currrentUser = newUser;
        res.redirect('/profile')
    })
    .catch(err => console.log(err))
 
});

/*Get - Profile */
router.get("/profile", (req, res) => {

    console.log(req.session.currrentUser); // For Authentication purpose

    
    if (req.session.currrentUser){
        const {username} = req.session.currrentUser;
        User.findOne({username})
            .then(foundUser => res.render("auth/profile", {user: foundUser}))
            .catch(err => console.log(err))
    }
    else {
        res.redirect('/login')
    }
    
});

/* Login page */////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*Get */
router.get('/login', (req, res) =>{
    console.log(req.session)
    res.render('auth/login')
});

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
            req.session.currrentUser = user;    // For Authentication purpose
            res.redirect('/profile/');
        } else {
          res.render('auth/login', { errorMessage: 'Incorrect password.' });
        }
      })
      .catch(err => next(err));
  });


  router.post('/logout',(req, res) => {
    req.session.destroy(err => {
      if (err) console.log(err);
      res.redirect('/');
    });
  });

module.exports = router;
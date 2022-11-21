const express = require('express');
const router = require("express").Router();

router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/hola", (req, res, next) => {
  res.render("auth/signup");
});

module.exports = router;

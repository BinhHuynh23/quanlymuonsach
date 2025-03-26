const express = require("express");
const UserController = require("../controllers/user.controller");

const routerUser = express.Router();

routerUser.route("/register")
  .post(UserController.register);

routerUser.route("/login")
  .post(UserController.login);

module.exports = routerUser;